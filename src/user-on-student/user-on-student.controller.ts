import { Controller, Get, Param } from '@nestjs/common';
import { UserOnStudentService } from './user-on-student.service';
import { ApiTags } from '@nestjs/swagger';
import { StudentEntity } from 'src/students/entities/student.entity';
// import { CreateUserOnStudentDto } from './dto/create-user-on-student.dto';
// import { UpdateUserOnStudentDto } from './dto/update-user-on-student.dto';

@Controller('user-on-student')
@ApiTags('user-on-student')
export class UserOnStudentController {
  constructor(private readonly userOnStudentService: UserOnStudentService) {}

  // @Post()
  // create(@Body() createUserOnStudentDto: CreateUserOnStudentDto) {
  //   return this.userOnStudentService.create(createUserOnStudentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userOnStudentService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userOnStudentService.findOne(+id);
  // }

  @Get('user/:userId')
  async findStudentsByUserId(@Param('userId') userId: string) {
    const userOnStudent =
      await this.userOnStudentService.findStudentByUserId(userId);
    return userOnStudent.map(
      (userOnStudent) => new StudentEntity(userOnStudent.student),
    );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserOnStudentDto: UpdateUserOnStudentDto) {
  //   return this.userOnStudentService.update(+id, updateUserOnStudentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userOnStudentService.remove(+id);
  // }
}
