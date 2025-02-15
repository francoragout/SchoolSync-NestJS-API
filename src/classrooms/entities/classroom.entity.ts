import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Classroom } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class ClassroomEntity implements Classroom {
  @ApiProperty()
  id: string;

  @ApiProperty()
  grade: $Enums.Grade;

  @ApiProperty()
  division: $Enums.Division;

  @ApiProperty()
  shift: $Enums.Shift;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  userId: string | null;

  @ApiProperty({ required: false, nullable: true })
  user?: UserEntity;

  constructor({ user, ...data }: Partial<ClassroomEntity> = {}) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }
}
