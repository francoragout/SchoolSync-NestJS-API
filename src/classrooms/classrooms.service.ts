import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const { grade, division, shift } = createClassroomDto;

    const existingClassroom = await this.prisma.classroom.findFirst({
      where: { grade, division, shift },
    });

    if (existingClassroom) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un aula con los mismos datos',
      });
    }

    return this.prisma.classroom.create({ data: createClassroomDto });
  }

  findAll() {
    return this.prisma.classroom.findMany({
      include: {
        _count: {
          select: { students: true },
        },
        user: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.classroom.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    const { grade, division, shift } = updateClassroomDto;

    const existingClassroom = await this.prisma.classroom.findFirst({
      where: { grade, division, shift, NOT: { id } },
    });

    if (existingClassroom) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un aula con los mismos datos',
      });
    }

    return this.prisma.classroom.update({
      where: { id },
      data: updateClassroomDto,
    });
  }

  remove(id: string) {
    return this.prisma.classroom.delete({ where: { id } });
  }

  removeMultiple(ids: string[]) {
    return this.prisma.classroom.deleteMany({ where: { id: { in: ids } } });
  }
}
