import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dni: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  image: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  classroomId: string;
}
