import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty()
  password?: string;
}
