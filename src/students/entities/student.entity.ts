import { ApiProperty } from '@nestjs/swagger';
import { Student } from '@prisma/client';
import { ClassroomEntity } from 'src/classrooms/entities/classroom.entity';

export class StudentEntity implements Student {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  classroomId: string;

  @ApiProperty({ required: false, nullable: true })
  classroom?: ClassroomEntity;

  constructor({ classroom, ...data }: Partial<StudentEntity> = {}) {
    Object.assign(this, data);

    if (classroom) {
      this.classroom = new ClassroomEntity(classroom);
    }
  }
}
