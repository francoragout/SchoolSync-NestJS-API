import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: createNotificationDto });
  }

  findAll() {
    return this.prisma.notification.findMany();
  }

  findByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  updateMultipleByUserId(
    userId: string,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.prisma.notification.updateMany({
      where: { userId },
      data: {
        ...updateNotificationDto,
        read: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
