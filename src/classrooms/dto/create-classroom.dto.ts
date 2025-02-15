import { ApiProperty } from '@nestjs/swagger';
import { Division, Grade, Shift } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  @ApiProperty()
  grade: Grade;

  @IsNotEmpty()
  @ApiProperty()
  division: Division;

  @IsNotEmpty()
  @ApiProperty()
  shift: Shift;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  userId: string | null;
}
