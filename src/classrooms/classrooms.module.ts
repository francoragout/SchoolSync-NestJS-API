import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  imports: [PrismaModule],
})
export class ClassroomsModule {}
