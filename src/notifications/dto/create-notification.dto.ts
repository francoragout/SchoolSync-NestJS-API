import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsBoolean()
  @ApiProperty({ default: false })
  read: boolean = false;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
