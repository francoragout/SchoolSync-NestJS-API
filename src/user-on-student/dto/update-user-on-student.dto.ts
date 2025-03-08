import { PartialType } from '@nestjs/swagger';
import { CreateUserOnStudentDto } from './create-user-on-student.dto';

export class UpdateUserOnStudentDto extends PartialType(CreateUserOnStudentDto) {}
