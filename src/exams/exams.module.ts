import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService, NotificationsService],
  imports: [PrismaModule],
})
export class ExamsModule {}
