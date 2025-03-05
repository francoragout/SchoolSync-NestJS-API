import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { RemoveMultipleUsersDto } from './dto/remove-multiple-users.dto';
import { CreateUserOnStudentDto } from './dto/create-user-on-student.dto';
import { UserOnStudentEntity } from './entities/user-on-student.entity';
import { RemoveUserOnStudentDto } from './dto/remove-user-on-student.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Post('student')
  @ApiCreatedResponse({ type: UserOnStudentEntity })
  async createUserOnStudent(
    @Body() createUserOnStudentDto: CreateUserOnStudentDto,
  ) {
    const userOnStudent = await this.usersService.createUserOnStudent(
      createUserOnStudentDto,
    );
    return new UserOnStudentEntity(userOnStudent);
  }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist.`);
    }
    return user;
  }

  @Get('student/:id')
  @ApiOkResponse({ type: UserOnStudentEntity })
  async findByStudentId(@Param('id') id: string) {
    const userOnStudent = await this.usersService.findByStudentId(id);
    return userOnStudent;
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete('student')
  @ApiOkResponse({ type: UserOnStudentEntity, isArray: true })
  async removeMultipleUserOnStudent(
    @Body() removeUserOnStudentDto: RemoveUserOnStudentDto,
  ) {
    const { ids, studentId } = removeUserOnStudentDto;
    const result = await this.usersService.removeUserOnStudent(ids, studentId);
    return { count: result.count };
  }

  @Delete()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async removeMultiple(@Body() removeMultipleUsersDto: RemoveMultipleUsersDto) {
    const { ids } = removeMultipleUsersDto;
    const deletedUsers = await this.usersService.removeMultiple(ids);
    return deletedUsers.count;
  }
}
