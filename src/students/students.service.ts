import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  create(createStudentDto: CreateStudentDto) {
    const { dni } = createStudentDto;
    const existingDni = this.prisma.student.findFirst({
      where: { dni },
    });

    if (existingDni) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un estudiante con el mismo DNI',
      });
    }

    return this.prisma.student.create({ data: createStudentDto });
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

  findOneByDni(dni: string) {
    return this.prisma.student.findUnique({
      where: { dni: dni },
      include: {
        attendance: true,
        classroom: true,
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
