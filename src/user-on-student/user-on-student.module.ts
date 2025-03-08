import { Module } from '@nestjs/common';
import { UserOnStudentService } from './user-on-student.service';
import { UserOnStudentController } from './user-on-student.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UserOnStudentController],
  providers: [UserOnStudentService],
  imports: [PrismaModule],
})
export class UserOnStudentModule {}
