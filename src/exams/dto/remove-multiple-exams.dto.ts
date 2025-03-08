import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class RemoveMultipleExamseDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  ids: string[];
}
