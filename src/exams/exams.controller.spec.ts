import { Test, TestingModule } from '@nestjs/testing';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamEntity } from './entities/exam.entity';

describe('ExamsController', () => {
  let controller: ExamsController;
  let service: ExamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsController],
      providers: [
        ExamsService,
        {
          provide: ExamsService,
          useValue: {
            create: jest.fn().mockResolvedValue(new ExamEntity()),
            findByStudentId: jest.fn().mockResolvedValue([new ExamEntity()]),
            findByClassroomId: jest.fn().mockResolvedValue([new ExamEntity()]),
            findOne: jest.fn().mockResolvedValue(new ExamEntity()),
            update: jest.fn().mockResolvedValue(new ExamEntity()),
            removeMultiple: jest.fn().mockResolvedValue({ count: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<ExamsController>(ExamsController);
    service = module.get<ExamsService>(ExamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an exam', async () => {
    const dto = new CreateExamDto();
    expect(await controller.create(dto)).toBeInstanceOf(ExamEntity);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of exams by student ID', async () => {
    const studentId = '1';
    expect(await controller.findByStudentId(studentId)).toBeInstanceOf(Array);
    expect(service.findByStudentId).toHaveBeenCalledWith(studentId);
  });

  it('should return an array of exams by classroom ID', async () => {
    const classroomId = '1';
    expect(await controller.findByClassroomId(classroomId)).toBeInstanceOf(
      Array,
    );
    expect(service.findByClassroomId).toHaveBeenCalledWith(classroomId);
  });

  it('should return a single exam', async () => {
    const id = '1';
    expect(await controller.findOne(id)).toBeInstanceOf(ExamEntity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update an exam', async () => {
    const id = '1';
    const dto = new CreateExamDto();
    expect(await controller.update(id, dto)).toBeInstanceOf(ExamEntity);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove multiple exams', async () => {
    const dto = { ids: ['1'] };
    expect(await controller.removeMultiple(dto)).toBe(1);
    expect(service.removeMultiple).toHaveBeenCalledWith(dto.ids);
  });
});
