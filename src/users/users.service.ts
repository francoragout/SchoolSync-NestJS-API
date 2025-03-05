import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserOnStudentDto } from './dto/create-user-on-student.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const existingEmail = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un usuario con el mismo email',
      });
    }

    return this.prisma.user.create({ data: createUserDto });
  }

  async createUserOnStudent(createUserOnStudent: CreateUserOnStudentDto) {
    const { studentId, ...createUserDto } = createUserOnStudent;
    const { email } = createUserDto;

    let user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({ data: createUserDto });
    }

    return this.prisma.userOnStudent.create({
      data: {
        userId: user.id,
        studentId: studentId,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        classrooms: {
          select: {
            id: true,
            grade: true,
            division: true,
            shift: true,
          },
        },
      },
    });
  }

  findByStudentId(studentId: string) {
    return this.prisma.userOnStudent.findMany({
      where: { studentId },
      include: {
        user: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        classrooms: true,
        notifications: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email } = updateUserDto;
    const existingEmail = await this.prisma.user.findFirst({
      where: { email, NOT: { id } },
    });

    if (existingEmail) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un usuario con el mismo email',
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async removeUserOnStudent(ids: string[], studentId: string) {
    const deleteResult = await this.prisma.userOnStudent.deleteMany({
      where: {
        userId: { in: ids },
        studentId: studentId,
      },
    });

    for (const id of ids) {
      const remainingRelations = await this.prisma.userOnStudent.count({
        where: { userId: id },
      });

      if (remainingRelations === 0) {
        await this.prisma.user.delete({
          where: { id },
        });
      }
    }

    return deleteResult;
  }

  removeMultiple(ids: string[]) {
    return this.prisma.user.deleteMany({ where: { id: { in: ids } } });
  }
}
