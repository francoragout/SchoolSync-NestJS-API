import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  create(createExamDto: CreateExamDto) {
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
