import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const { grade, division, shift } = createClassroomDto;
    
    const shiftTranslation = {
      MORNING: 'Mañana',
      AFTERNOON: 'Tarde',
    };
  
    const gradesTranslation = {
      FIRST: 'Primero',
      SECOND: 'Segundo',
      THIRD: 'Tercero',
      FOURTH: 'Cuarto',
      FIFTH: 'Quinto',
      SIXTH: 'Sexto',
    };
    
    const existingClassroom = await this.prisma.classroom.findFirst({
      where: { grade, division, shift },
    });
    
    if (existingClassroom) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un aula con los mismos datos',
      });
    }

    if (createClassroomDto.userId) {
      await this.prisma.notification.create({
        data: {
          title: 'Has sido asignado a un aula',
          body: `${gradesTranslation[grade]} ${division} ${shiftTranslation[shift]}`,
          link: `/school/classrooms`,
          userId: createClassroomDto.userId,
        },
      });
    }

    return this.prisma.classroom.create({ data: createClassroomDto });
  }

  createMultiple(createClassroomDtos: CreateClassroomDto[]) {
    return this.prisma.classroom.createMany({ data: createClassroomDtos });
  }

  findAll() {
    return this.prisma.classroom.findMany({
      include: {
        _count: {
          select: { students: true, exams: true },
        },
        user: true,
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.classroom.findMany({
      where: { userId },
      include: {
        _count: {
          select: { students: true, exams: true },
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

    const shiftTranslation = {
      MORNING: 'Mañana',
      AFTERNOON: 'Tarde',
    };
  
    const gradesTranslation = {
      FIRST: 'Primero',
      SECOND: 'Segundo',
      THIRD: 'Tercero',
      FOURTH: 'Cuarto',
      FIFTH: 'Quinto',
      SIXTH: 'Sexto',
    };

    const existingClassroom = await this.prisma.classroom.findFirst({
      where: { grade, division, shift, NOT: { id } },
    });

    if (existingClassroom) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un aula con los mismos datos',
      });
    }

    if (updateClassroomDto.userId) {
      await this.prisma.notification.create({
        data: {
          title: 'Has sido asignado a un aula',
          body: `${gradesTranslation[grade]} ${division} ${shiftTranslation[shift]}`,
          link: `/school/classrooms`,
          userId: updateClassroomDto.userId,
        },
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
