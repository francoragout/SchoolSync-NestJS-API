import { ApiProperty } from '@nestjs/swagger';
import { Subjet } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  subject: Subjet;

  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  time: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  note: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  classroomId: string;
}
