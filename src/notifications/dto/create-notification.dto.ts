import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  body: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  link: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
