import { ApiProperty } from '@nestjs/swagger';

export class UserOnStudentEntity {
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
