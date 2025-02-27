import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AttendanceEntity } from './entities/attendance.entity';
import { CreateMultipleAttendanceDto } from './dto/create-multiple-attendance.dto';
import { RemoveMultipleAttendanceDto } from './dto/remove-multiple-attendance.dto';

@Controller('attendance')
@ApiTags('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateAttendanceDto })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('multiple')
  @ApiCreatedResponse({ type: CreateMultipleAttendanceDto })
  createMultiple(
    @Body() createMultipleAttendanceDto: CreateMultipleAttendanceDto,
  ) {
    return this.attendanceService.createMultiple(createMultipleAttendanceDto);
  }

  @Get()
  @ApiCreatedResponse({ type: CreateAttendanceDto, isArray: true })
  async findAll() {
    const attendance = await this.attendanceService.findAll();
    return attendance.map((attendance) => new AttendanceEntity(attendance));
  }

  @Get('student/:studentId')
  @ApiOkResponse({ type: CreateAttendanceDto, isArray: true })
  async findByStudentId(@Param('studentId') studentId: string) {
    const attendance = await this.attendanceService.findByStudentId(studentId);
    return attendance.map((attendance) => new AttendanceEntity(attendance));
  }

  @Get(':id')
  @ApiOkResponse({ type: CreateAttendanceDto })
  async findOne(@Param('id') id: string) {
    return new AttendanceEntity(await this.attendanceService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreateAttendanceDto })
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return new AttendanceEntity(
      await this.attendanceService.update(id, updateAttendanceDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: CreateAttendanceDto })
  async remove(@Param('id') id: string) {
    return new AttendanceEntity(await this.attendanceService.remove(id));
  }

  @Delete()
  @ApiOkResponse({ type: CreateAttendanceDto, isArray: true })
  async removeMultiple(
    @Body() removeMultipleAttendanceDto: RemoveMultipleAttendanceDto,
  ) {
    const { ids } = removeMultipleAttendanceDto;
    const deletedAttendance = await this.attendanceService.removeMultiple(ids);
    return deletedAttendance.count;
  }
}
