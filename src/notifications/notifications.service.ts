import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: createNotificationDto });
  }

  findByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.prisma.notification.deleteMany({
      where: {
        read: true,
        updatedAt: {
          lt: sevenDaysAgo,
        },
      },
    });
  }
}
