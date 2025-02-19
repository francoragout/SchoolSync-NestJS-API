import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { StudentsModule } from './students/students.module';
@Module({
  imports: [UsersModule, NotificationsModule, ClassroomsModule, StudentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
