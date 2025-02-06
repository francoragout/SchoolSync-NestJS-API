import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
@Module({
  imports: [UsersModule, NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
