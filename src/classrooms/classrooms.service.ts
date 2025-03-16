import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ClassroomsService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationsService,
  ) {}

  private readonly shiftTranslation = {
    MORNING: 'Mañana',
    AFTERNOON: 'Tarde',
  };

  private readonly gradesTranslation = {
    FIRST: 'Primero',
    SECOND: 'Segundo',
    THIRD: 'Tercero',
    FOURTH: 'Cuarto',
    FIFTH: 'Quinto',
    SIXTH: 'Sexto',
  };

  async create(createClassroomDto: CreateClassroomDto) {
    const { grade, division, shift, userId } = createClassroomDto;

    const existingClassroom = await this.prisma.classroom.findFirst({
      where: { grade, division, shift },
    });

    if (existingClassroom) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un aula con los mismos datos',
      });
    }

    const classroom = await this.prisma.classroom.create({
      data: { grade, division, shift },
    });

    if (userId) {
      await this.notification.create({
        userId,
        title: 'Has sido asignado a un aula',
        body: `${this.gradesTranslation[grade]} ${division} ${this.shiftTranslation[shift]}`,
        link: `/school/classrooms`,
      });
    }

    return classroom;
  }

  findAll() {
    return this.prisma.classroom.findMany({
      include: {
        _count: { select: { students: true, exams: true } },
        user: true,
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.classroom.findMany({
      where: { userId },
      include: {
        _count: { select: { students: true, exams: true } },
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
    });

    if (!classroom) {
      throw new NotFoundException('Aula no encontrada');
    }

    return classroom;
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    const { grade, division, shift, userId } = updateClassroomDto;

    const existingClassroom = await this.prisma.classroom.findFirst({
      where: { grade, division, shift, NOT: { id } },
    });

    if (existingClassroom) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un aula con los mismos datos',
      });
    }

    if (userId) {
      await this.notification.create({
        userId,
        title: 'Has sido asignado a un aula',
        body: `${this.gradesTranslation[grade]} ${division} ${this.shiftTranslation[shift]}`,
        link: `/school/classrooms`,
      });
    }

    return this.prisma.classroom.update({
      where: { id },
      data: updateClassroomDto,
    });
  }

  async removeMultiple(ids: string[]) {
    return this.prisma.classroom.deleteMany({ where: { id: { in: ids } } });
  }
}
