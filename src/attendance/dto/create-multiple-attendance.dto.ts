import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsArray, IsDate, IsString } from 'class-validator';

export class CreateMultipleAttendanceDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  ids: string[];

  @IsString()
  @ApiProperty()
  status: Status;

  @IsDate()
  @ApiProperty()
  date: Date;
}
