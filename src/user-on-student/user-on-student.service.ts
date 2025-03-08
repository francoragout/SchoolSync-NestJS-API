import { Injectable } from '@nestjs/common';
// import { CreateUserOnStudentDto } from './dto/create-user-on-student.dto';
// import { UpdateUserOnStudentDto } from './dto/update-user-on-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserOnStudentService {
  constructor(private prisma: PrismaService) {}

  // create(createUserOnStudentDto: CreateUserOnStudentDto) {
  //   return 'This action adds a new userOnStudent';
  // }

  // findAll() {
  //   return `This action returns all userOnStudent`;
  // }

  findStudentByUserId(userId: string) {
    return this.prisma.userOnStudent.findMany({
      where: { userId },
      select: {
        student: {
          include: { attendance: true },
        },
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} userOnStudent`;
  // }

  // update(id: number, updateUserOnStudentDto: UpdateUserOnStudentDto) {
  //   return `This action updates a #${id} userOnStudent`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userOnStudent`;
  // }
}
