import { IsArray, IsString } from 'class-validator';

export class RemoveMultipleUsersDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}