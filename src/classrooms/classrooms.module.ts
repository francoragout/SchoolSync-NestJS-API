import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService, NotificationsService],
  imports: [PrismaModule],
})
export class ClassroomsModule {}
