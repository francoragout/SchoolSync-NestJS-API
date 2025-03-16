import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { StudentEntity } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        StudentsService,
        {
          provide: StudentsService,
          useValue: {
            create: jest.fn().mockResolvedValue(new StudentEntity()),
            findByClassroomId: jest
              .fn()
              .mockResolvedValue([new StudentEntity()]),
            findOne: jest.fn().mockResolvedValue(new StudentEntity()),
            findByUserId: jest.fn().mockResolvedValue([new StudentEntity()]),
            update: jest.fn().mockResolvedValue(new StudentEntity()),
            removeMultiple: jest.fn().mockResolvedValue({ count: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a student', async () => {
    const dto = new CreateStudentDto();
    expect(await controller.create(dto)).toBeInstanceOf(StudentEntity);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of students by classroom ID', async () => {
    const classroomId = '1';
    expect(await controller.findByClassroomId(classroomId)).toBeInstanceOf(
      Array,
    );
    expect(service.findByClassroomId).toHaveBeenCalledWith(classroomId);
  });

  it('should return a student by ID', async () => {
    const id = '1';
    expect(await controller.findOne(id)).toBeInstanceOf(StudentEntity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should return an array of students by user ID', async () => {
    const userId = '1';
    expect(await controller.findByUserId(userId)).toBeInstanceOf(Array);
    expect(service.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('should update a student', async () => {
    const id = '1';
    const dto = new CreateStudentDto();
    expect(await controller.update(id, dto)).toBeInstanceOf(StudentEntity);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove multiple students', async () => {
    const dto = { ids: ['1'] };
    expect(await controller.removeMultiple(dto)).toBe(1);
    expect(service.removeMultiple).toHaveBeenCalledWith(dto.ids);
  });
});
