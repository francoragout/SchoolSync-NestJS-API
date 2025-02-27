import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  removeMultiple(ids: string[]) {
    return this.prisma.user.deleteMany({ where: { id: { in: ids } } });
  }
}
