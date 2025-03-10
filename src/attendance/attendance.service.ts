import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMultipleAttendanceDto } from './dto/create-multiple-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  create(createAttendanceDto: CreateAttendanceDto) {
    return this.prisma.attendance.create({ data: createAttendanceDto });
  }

  async createMultiple(
    createMultipleAttendanceDto: CreateMultipleAttendanceDto,
  ) {
    const { ids, status } = createMultipleAttendanceDto;
    const attendances = ids.map((id) => ({
      studentId: id,
      status,
      date: new Date(),
    }));

    const date = new Date().toLocaleDateString();

    for (const id of ids) {
      const userOnStudent = await this.prisma.userOnStudent.findMany({
        where: { studentId: id },
        include: { student: true },
      });

      const statusTranslations = {
        TARDY: 'Tarde',
        ABSENT: 'Ausente',
        JUSTIFIED: 'Justificado',
      };

      for (const relation of userOnStudent) {
        await this.prisma.notification.create({
          data: {
            userId: relation.userId,
            title: 'Aistencia',
            body: `El alumno ${relation.student.firstName} ${relation.student.lastName} ha sido marcado como ${statusTranslations[status]} el dia ${date}`,
            link: `/students/${relation.studentId}/attendance`,
          },
        });
      }
    }

    return this.prisma.attendance.createMany({ data: attendances });
  }

  findAll() {
    return this.prisma.attendance.findMany();
  }

  findByStudentId(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
    });
  }

  findOne(id: string) {
    return this.prisma.attendance.findUnique({
      where: { id },
    });
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return this.prisma.attendance.update({
      where: { id },
      data: updateAttendanceDto,
    });
  }

  remove(id: string) {
    return this.prisma.attendance.delete({ where: { id } });
  }

  removeMultiple(ids: string[]) {
    return this.prisma.attendance.deleteMany({ where: { id: { in: ids } } });
  }
}
