import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  status: Status;

  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  studentId: string;
}
