import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class NotificationEntity implements Notification {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false, type: UserEntity })
  user?: UserEntity;

  constructor({ user, ...data }: Partial<NotificationEntity> = {}) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }
}
