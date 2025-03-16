import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserOnStudentEntity } from './entities/user-on-student.entity';
import { CreateUserOnStudentDto } from './dto/create-user-on-student.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(new UserEntity({})),
            createUserOnStudent: jest
              .fn()
              .mockResolvedValue(new UserOnStudentEntity({})),
            findAll: jest.fn().mockResolvedValue([new UserEntity({})]),
            findByStudentId: jest.fn().mockResolvedValue([new UserEntity({})]),
            findOne: jest.fn().mockResolvedValue(new UserEntity({})),
            update: jest.fn().mockResolvedValue(new UserEntity({})),
            removeMultiple: jest.fn().mockResolvedValue({ count: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = new CreateUserDto();
    expect(await controller.create(dto)).toBeInstanceOf(UserEntity);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should create a user on student', async () => {
    const dto = new CreateUserOnStudentDto();
    expect(await controller.createUserOnStudent(dto)).toBeInstanceOf(
      UserOnStudentEntity,
    );
    expect(service.createUserOnStudent).toHaveBeenCalledWith(dto);
  });

  it('should return an array of users', async () => {
    expect(await controller.findAll()).toBeInstanceOf(Array);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return an array of users by student ID', async () => {
    const studentId = '1';
    expect(await controller.findByStudentId(studentId)).toBeInstanceOf(Array);
    expect(service.findByStudentId).toHaveBeenCalledWith(studentId);
  });

  it('should return a single user', async () => {
    const id = '1';
    expect(await controller.findOne(id)).toBeInstanceOf(UserEntity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });


  it('should update a user', async () => {
    const id = '1';
    const dto = new CreateUserDto();
    expect(await controller.update(id, dto)).toBeInstanceOf(UserEntity);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove multiple users', async () => {
    const dto = { ids: ['1'] };
    expect(await controller.removeMultiple(dto)).toBe(1);
    expect(service.removeMultiple).toHaveBeenCalledWith(dto.ids);
  });
});
