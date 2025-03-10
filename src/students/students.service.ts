import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = await this.prisma.student.create({
      data: createStudentDto,
    });

    const users = await this.prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'PRECEPTOR'] } },
    });

    for (const user of users) {
      await this.prisma.notification.create({
        data: {
          title: 'Nuevo Estudiante',
          body: `Se ha agregado a ${student.firstName} ${student.lastName}`,
          link: `/school/classrooms/${student.classroomId}/students`,
          userId: user.id,
        },
      });
    }

    return student;
  }

  findAll() {
    return this.prisma.student.findMany({
      include: {
        attendance: true,
      },
    });
  }

  findByClassroomId(classroomId: string) {
    return this.prisma.student.findMany({
      where: { classroomId: classroomId },
      include: {
        attendance: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        attendance: true,
        classroom: true,
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.userOnStudent.findMany({
      where: { userId: userId },
      include: {
        student: {
          include: {
            classroom: true, // Esto incluirá todos los detalles de la clase
          },
        },
      },
    });
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
    });
  }

  remove(id: string) {
    return this.prisma.student.delete({ where: { id } });
  }

  removeMultiple(ids: string[]) {
    return this.prisma.student.deleteMany({ where: { id: { in: ids } } });
  }
}
