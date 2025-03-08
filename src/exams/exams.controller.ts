import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExamEntity } from './entities/exam.entity';
import { RemoveMultipleExamseDto } from './dto/remove-multiple-exams.dto';

@Controller('exams')
@ApiTags('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateExamDto })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @ApiCreatedResponse({ type: CreateExamDto, isArray: true })
  async findAll() {
    const exams = await this.examsService.findAll();
    return exams.map((exam) => new ExamEntity(exam));
  }

  @Get('student/:studentId')
  @ApiCreatedResponse({ type: CreateExamDto, isArray: true })
  async findByStudentId(@Param('studentId') studentId: string) {
    const exams = await this.examsService.findByStudentId(studentId);
    return exams.map((exam) => new ExamEntity(exam));
  }

  @Get('classroom/:classroomId')
  @ApiCreatedResponse({ type: CreateExamDto, isArray: true })
  async findByClassroomId(@Param('classroomId') classroomId: string) {
    const exams = await this.examsService.findByClassroomId(classroomId);
    return exams.map((exam) => new ExamEntity(exam));
  }

  @Get(':id')
  @ApiCreatedResponse({ type: CreateExamDto })
  async findOne(@Param('id') id: string) {
    return new ExamEntity(await this.examsService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreateExamDto })
  async update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return new ExamEntity(await this.examsService.update(id, updateExamDto));
  }

  @Delete()
  @ApiOkResponse({ type: CreateExamDto })
  async removeMultiple(@Body() removeMultipleExamDto: RemoveMultipleExamseDto) {
    const { ids } = removeMultipleExamDto;
    const deletedExams = await this.examsService.removeMultiple(ids);
    return deletedExams.count;
  }

  @Delete(':id')
  @ApiOkResponse({ type: CreateExamDto })
  async remove(@Param('id') id: string) {
    return new ExamEntity(await this.examsService.remove(id));
  }
}
