import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, NotificationsService],
  imports: [PrismaModule],
})
export class AttendanceModule {}
