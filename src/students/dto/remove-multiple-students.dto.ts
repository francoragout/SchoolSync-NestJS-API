import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class RemoveMultipleStudentsDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  ids: string[];
}
