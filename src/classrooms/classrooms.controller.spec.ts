import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomEntity } from './entities/classroom.entity';
import { RemoveMultipleClassroomsDto } from './dto/remove-multiple-classrooms.dto';

describe('ClassroomsController', () => {
  let controller: ClassroomsController;
  let service: ClassroomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomsController],
      providers: [
        {
          provide: ClassroomsService,
          useValue: {
            create: jest.fn().mockResolvedValue(new ClassroomEntity()),
            findAll: jest.fn().mockResolvedValue([new ClassroomEntity()]),
            findByUserId: jest.fn().mockResolvedValue([new ClassroomEntity()]),
            findOne: jest.fn().mockResolvedValue(new ClassroomEntity()),
            update: jest.fn().mockResolvedValue(new ClassroomEntity()),
            removeMultiple: jest.fn().mockResolvedValue({ count: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<ClassroomsController>(ClassroomsController);
    service = module.get<ClassroomsService>(ClassroomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a classroom', async () => {
    const dto = new CreateClassroomDto();
    expect(await controller.create(dto)).toBeInstanceOf(ClassroomEntity);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of classrooms', async () => {
    expect(await controller.findAll()).toBeInstanceOf(Array);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return classrooms by user ID', async () => {
    const userId = '1';
    expect(await controller.findByUserId(userId)).toBeInstanceOf(Array);
    expect(service.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('should return a single classroom', async () => {
    const id = '1';
    expect(await controller.findOne(id)).toBeInstanceOf(ClassroomEntity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a classroom', async () => {
    const id = '1';
    const dto = new UpdateClassroomDto();
    expect(await controller.update(id, dto)).toBeInstanceOf(ClassroomEntity);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove multiple classrooms', async () => {
    const dto = new RemoveMultipleClassroomsDto();
    dto.ids = ['1'];
    expect(await controller.removeMultiple(dto)).toBe(1);
    expect(service.removeMultiple).toHaveBeenCalledWith(dto.ids);
  });
});