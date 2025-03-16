import { ApiProperty } from '@nestjs/swagger';
import { Exam, Subject } from '@prisma/client';
import { ClassroomEntity } from 'src/classrooms/entities/classroom.entity';

export class ExamEntity implements Exam {
  @ApiProperty()
  id: string;

  @ApiProperty()
  subject: Subject;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  time: string;

  @ApiProperty()
  note: string;

  @ApiProperty()
  classroomId: string;

  @ApiProperty()
  classroom: ClassroomEntity;

  constructor({ classroom, ...data }: Partial<ExamEntity> = {}) {
    Object.assign(this, data);

    if (classroom) {
      this.classroom = new ClassroomEntity(classroom);
    }
  }
}
