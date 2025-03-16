import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, NotificationsService],
  imports: [PrismaModule],
})
export class StudentsModule {}
