import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@prisma/client';

export class NotificationEntity implements Notification {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  userId: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
