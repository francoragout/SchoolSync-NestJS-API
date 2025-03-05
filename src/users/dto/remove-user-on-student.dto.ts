import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class RemoveUserOnStudentDto {
    @IsString({ each: true })
    @IsArray()
    @ApiProperty()
    ids: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    studentId: string;
  }