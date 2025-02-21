import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Attendance } from '@prisma/client';
import { StudentEntity } from 'src/students/entities/student.entity';

export class AttendanceEntity implements Attendance {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: $Enums.Status;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  student: StudentEntity;

  constructor({ student, ...data }: Partial<AttendanceEntity> = {}) {
    Object.assign(this, data);

    if (student) {
      this.student = new StudentEntity(student);
    }
  }
}
