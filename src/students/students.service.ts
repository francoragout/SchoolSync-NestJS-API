import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationsService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = await this.prisma.student.create({
      data: createStudentDto,
    });

    const classroom = await this.prisma.classroom.findUnique({
      where: { id: student.classroomId },
      select: { userId: true },
    });

    if (classroom.userId) {
      await this.notification.create({
        title: 'Nuevo Alumno',
        body: `Se ha agregado a ${student.firstName} ${student.lastName}`,
        link: `/school/classrooms/${student.classroomId}/students`,
        userId: classroom.userId,
      });
    }

    return student;
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
            classroom: true,
            attendance: true,
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

  removeMultiple(ids: string[]) {
    return this.prisma.student.deleteMany({ where: { id: { in: ids } } });
  }
}
