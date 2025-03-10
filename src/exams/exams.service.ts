import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    const students = await this.prisma.student.findMany({
      where: { classroomId: createExamDto.classroomId },
    });

    const examDate = new Date(createExamDto.date).toLocaleDateString();

    for (const student of students) {
      const userOnStudents = await this.prisma.userOnStudent.findMany({
        where: { studentId: student.id },
        include: { user: true },
      });

      const subjetTranslation = {
        MATH: 'Matemáticas',
        LITERATURE: 'Literatura',
        HISTORY: 'Historia',
        GEOGRAPHY: 'Geografía',
        BIOLOGY: 'Biología',
        PHYSICS: 'Física',
        CHEMISTRY: 'Química',
        ENGLISH: 'Inglés',
        PHYSICAL_EDUCATION: 'Educación Física',
        RELIGION: 'Religión',
      };

      for (const userOnStudent of userOnStudents) {
        await this.prisma.notification.create({
          data: {
            userId: userOnStudent.user.id,
            title: 'Examen',
            body: `El alumno ${student.firstName} ${student.lastName} tiene un examen de ${subjetTranslation[createExamDto.subject]} el dia ${examDate}`,
            link: `/students/${student.id}/exams`,
          },
        });
      }
    }

    return this.prisma.exam.create({ data: createExamDto });
  }

  findAll() {
    return this.prisma.exam.findMany();
  }

  async findByStudentId(studentId: string) {
    const classroom = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: { classroomId: true },
    });

    return this.prisma.exam.findMany({
      where: { classroomId: classroom.classroomId },
    });
  }

  findByClassroomId(classroomId: string) {
    return this.prisma.exam.findMany({
      where: { classroomId: classroomId },
    });
  }

  findOne(id: string) {
    return this.prisma.exam.findUnique({
      where: { id },
    });
  }

  update(id: string, updateExamDto: UpdateExamDto) {
    return this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
    });
  }

  remove(id: string) {
    return this.prisma.exam.delete({ where: { id } });
  }

  removeMultiple(ids: string[]) {
    return this.prisma.exam.deleteMany({ where: { id: { in: ids } } });
  }
}
