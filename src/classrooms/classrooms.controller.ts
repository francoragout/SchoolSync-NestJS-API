import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClassroomEntity } from './entities/classroom.entity';
import { RemoveMultipleClassroomsDto } from './dto/remove-multiple-classrooms.dto';

@Controller('classrooms')
@ApiTags('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateClassroomDto })
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    return new ClassroomEntity(
      await this.classroomsService.create(createClassroomDto),
    );
  }

  @Post('multiple')
  @ApiCreatedResponse({ type: CreateClassroomDto, isArray: true })
  async createMultiple(@Body() createClassroomDtos: CreateClassroomDto[]) {
    const createdClassrooms =
      await this.classroomsService.createMultiple(createClassroomDtos);
    return createdClassrooms.count;
  }

  @Get()
  @ApiCreatedResponse({ type: CreateClassroomDto, isArray: true })
  async findAll() {
    const classrooms = await this.classroomsService.findAll();
    return classrooms.map((classroom) => new ClassroomEntity(classroom));
  }

  @Get('user/:userId')
  @ApiCreatedResponse({ type: CreateClassroomDto, isArray: true })
  async findByUserId(@Param('userId') userId: string) {
    const classrooms = await this.classroomsService.findByUserId(userId);
    return classrooms.map((classroom) => new ClassroomEntity(classroom));
  }

  @Get(':id')
  @ApiOkResponse({ type: CreateClassroomDto })
  async findOne(@Param('id') id: string) {
    return new ClassroomEntity(await this.classroomsService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreateClassroomDto })
  async update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return new ClassroomEntity(
      await this.classroomsService.update(id, updateClassroomDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: CreateClassroomDto })
  async remove(@Param('id') id: string) {
    return new ClassroomEntity(await this.classroomsService.remove(id));
  }

  @Delete()
  @ApiOkResponse({ type: CreateClassroomDto, isArray: true })
  async removeMultiple(
    @Body() removeMultipleClassroomsDto: RemoveMultipleClassroomsDto,
  ) {
    const { ids } = removeMultipleClassroomsDto;
    const deletedClassrooms = await this.classroomsService.removeMultiple(ids);
    return deletedClassrooms.count;
  }
}
