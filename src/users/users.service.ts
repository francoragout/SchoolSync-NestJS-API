import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserOnStudentDto } from './dto/create-user-on-student.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, role, firstName, lastName } = createUserDto;

    // Verificar si el email ya existe
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException({
        status: 'exists',
        message: 'Ya existe un usuario con el mismo email',
      });
    }

    // Crear usuario
    const user = await this.prisma.user.create({ data: createUserDto });

    // Buscar preceptores
    const preceptors = await this.prisma.user.findMany({
      where: { role: 'PRECEPTOR' },
    });

    // Mapeo de roles
    const roleTranslation: Record<string, string> = {
      ADMIN: 'Administrador',
      PRECEPTOR: 'Preceptor',
    };

    const notificationLink = role === 'ADMIN' ? 'admins' : 'preceptors';

    // Crear notificaciones en paralelo
    await Promise.all(
      preceptors.map((preceptor) =>
        this.notification.create({
          title: `Nuevo ${roleTranslation[role]}`,
          body: `Se ha agregado a ${firstName} ${lastName}`,
          userId: preceptor.id,
          link: `/school/${notificationLink}`,
        }),
      ),
    );

    return user;
  }

  async createUserOnStudent(createUserOnStudent: CreateUserOnStudentDto) {
    const { studentId, email, firstName, lastName, role } = createUserOnStudent;

    let user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email, firstName, lastName, role },
      });

      // Buscar el estudiante y su aula
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        select: { classroomId: true },
      });

      if (!student) {
        throw new NotFoundException('El estudiante no existe');
      }

      // Buscar el preceptor de la clase
      const classroom = await this.prisma.classroom.findUnique({
        where: { id: student.classroomId },
        select: { userId: true },
      });

      // Validar si existe userId antes de crear la notificación
      if (classroom?.userId) {
        await this.prisma.notification.create({
          data: {
            title: 'Nuevo Tutor',
            body: `Se ha agregado a ${firstName} ${lastName}`,
            userId: classroom.userId,
            link: `/school/classrooms/${student.classroomId}/students/${studentId}/tutors`,
          },
        });
      }
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

    if (email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { email, NOT: { id } },
      });

      if (existingEmail) {
        throw new ConflictException({
          status: 'exists',
          message: 'Ya existe un usuario con el mismo email',
        });
      }

      const hasAccounts = await this.prisma.account.findFirst({
        where: { userId: id },
      });

      if (hasAccounts) {
        throw new ConflictException({
          status: 'update',
          message:
            'No se puede modificar el email de un usuario con cuentas asociadas',
        });
      }
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

    // Encuentra los usuarios que ya no tienen relaciones en userOnStudent
    const usersWithoutRelations = await this.prisma.user.findMany({
      where: {
        id: { in: ids },
        students: { none: {} },
      },
      select: { id: true },
    });

    if (usersWithoutRelations.length > 0) {
      await this.prisma.user.deleteMany({
        where: { id: { in: usersWithoutRelations.map((user) => user.id) } },
      });
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
