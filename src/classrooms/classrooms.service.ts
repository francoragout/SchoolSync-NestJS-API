import { Injectable } from '@nestjs/common';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  create(createClassroomDto: CreateClassroomDto) {
    return this.prisma.classroom.create({ data: createClassroomDto });
  }

  findAll() {
    return this.prisma.classroom.findMany();
  }

  findOne(id: string) {
    return this.prisma.classroom.findUnique({
      where: { id },
      include: {
        students: true,
        user: true,
      },
    });
  }

  update(id: string, updateClassroomDto: UpdateClassroomDto) {
    return this.prisma.classroom.update({
      where: { id },
      data: updateClassroomDto,
    });
  }

  remove(id: string) {
    return this.prisma.classroom.delete({ where: { id } });
  }
}
