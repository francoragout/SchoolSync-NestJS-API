import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { StudentsModule } from './students/students.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExamsModule } from './exams/exams.module';
@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    ClassroomsModule,
    StudentsModule,
    AttendanceModule,
    ExamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
