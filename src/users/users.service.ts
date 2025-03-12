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

    const user = await this.prisma.user.create({ data: createUserDto });

    const preceptors = await this.prisma.user.findMany({
      where: { role: 'PRECEPTOR' },
    });

    const roleTranslation = {
      ADMIN: 'Administrador',
      PRECEPTOR: 'Preceptor',
    };

    const notificationLink =
      createUserDto.role === 'ADMIN' ? '/admins' : '/preceptors';

    for (const preceptor of preceptors) {
      await this.prisma.notification.create({
        data: {
          title: `Nuevo ${roleTranslation[createUserDto.role]}`,
          body: `Se ha agregado a ${createUserDto.firstName} ${createUserDto.lastName}`,
          userId: preceptor.id,
          link: `/school/${notificationLink}`,
        },
      });
    }

    return user;
  }

  async createUserOnStudent(createUserOnStudent: CreateUserOnStudentDto) {
    const { studentId, ...createUserDto } = createUserOnStudent;
    const { email } = createUserDto;

    let user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({ data: createUserDto });

      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        select: { classroomId: true },
      });

      const classroom = await this.prisma.classroom.findUnique({
        where: { id: student.classroomId },
        select: { userId: true },
      });

      await this.prisma.notification.create({
        data: {
          title: 'Nuevo Tutor',
          body: `Se ha agregado a ${createUserDto.firstName} ${createUserDto.lastName}`,
          userId: classroom.userId,
          link: `/school/classrooms/${student.classroomId}/students/${studentId}/tutors`,
        },
      });
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

  findStudentByUserId(userId: string) {
    return this.prisma.userOnStudent.findMany({
      where: { userId },
      select: {
        student: {
          include: { attendance: true },
        },
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

    const accounts = await this.prisma.account.findMany({
      where: { userId: id },
    });

    if (accounts.length > 0) {
      throw new ConflictException({
        status: 'update',
        message:
          'No se puede modificar el email de un usuario con cuentas asociadas',
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

  async removeMultiple(ids: string[]) {
    // Verificar la cantidad de administradores
    const adminCount = await this.prisma.user.count({
      where: { role: 'ADMIN' },
    });

    // Contar cuántos administradores están en la lista de ids a eliminar
    const adminsToDelete = await this.prisma.user.count({
      where: {
        id: { in: ids },
        role: 'ADMIN',
      },
    });

    // Si se intenta eliminar a todos los administradores, lanzar una excepción
    if (adminCount === adminsToDelete) {
      throw new ConflictException({
        status: 'error',
        message: 'No se puede eliminar a todos los administradores',
      });
    }

    return this.prisma.user.deleteMany({ where: { id: { in: ids } } });
  }
}
