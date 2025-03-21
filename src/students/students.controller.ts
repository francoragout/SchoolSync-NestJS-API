import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RemoveMultipleStudentsDto } from './dto/remove-multiple-students.dto';

@Controller('students')
@ApiTags('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOkResponse({ type: CreateStudentDto })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return new StudentEntity(
      await this.studentsService.create(createStudentDto),
    );
  }

  @Get('classroom/:classroomId')
  @ApiOkResponse({ type: CreateStudentDto, isArray: true })
  async findByClassroomId(@Param('classroomId') classroomId: string) {
    const students = await this.studentsService.findByClassroomId(classroomId);
    return students.map((student) => new StudentEntity(student));
  }

  @Get(':id')
  @ApiOkResponse({ type: CreateStudentDto })
  async findOne(@Param('id') id: string) {
    return new StudentEntity(await this.studentsService.findOne(id));
  }

  @Get('user/:userId')
  @ApiOkResponse({ type: CreateStudentDto, isArray: true })
  async findByUserId(@Param('userId') userId: string) {
    const userOnStudent = await this.studentsService.findByUserId(userId);
    return userOnStudent.map((user) => new StudentEntity(user.student));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreateStudentDto })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return new StudentEntity(
      await this.studentsService.update(id, updateStudentDto),
    );
  }

  @Delete()
  @ApiOkResponse({ type: CreateStudentDto, isArray: true })
  async removeMultiple(
    @Body() removeMultipleStudentDto: RemoveMultipleStudentsDto,
  ) {
    const { ids } = removeMultipleStudentDto;
    const deleteStudents = await this.studentsService.removeMultiple(ids);
    return deleteStudents.count;
  }
}
