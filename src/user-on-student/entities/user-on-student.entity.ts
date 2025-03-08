import { ApiProperty } from '@nestjs/swagger';
import { UserOnStudent } from '@prisma/client';

export class UserOnStudentEntity implements UserOnStudent {
  constructor(partial: Partial<UserOnStudentEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  userId: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
