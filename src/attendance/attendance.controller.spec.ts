import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceEntity } from './entities/attendance.entity';
import { CreateMultipleAttendanceDto } from './dto/create-multiple-attendance.dto';
import { RemoveMultipleAttendanceDto } from './dto/remove-multiple-attendance.dto';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        AttendanceService,
        {
          provide: AttendanceService,
          useValue: {
            createMultiple: jest
              .fn()
              .mockResolvedValue([new AttendanceEntity()]),
            findByStudentId: jest
              .fn()
              .mockResolvedValue([new AttendanceEntity()]),
            findOne: jest.fn().mockResolvedValue(new AttendanceEntity()),
            update: jest.fn().mockResolvedValue(new AttendanceEntity()),
            removeMultiple: jest.fn().mockResolvedValue({ count: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create multiple attendances', async () => {
    const dto = new CreateMultipleAttendanceDto();
    expect(await controller.createMultiple(dto)).toBeInstanceOf(Array);
    expect(service.createMultiple).toHaveBeenCalledWith(dto);
  });

  it('should return an array of attendances by student ID', async () => {
    const studentId = '1';
    expect(await controller.findByStudentId(studentId)).toBeInstanceOf(Array);
    expect(service.findByStudentId).toHaveBeenCalledWith(studentId);
  });

  it('should return a single attendance', async () => {
    const id = '1';
    expect(await controller.findOne(id)).toBeInstanceOf(AttendanceEntity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update an attendance', async () => {
    const id = '1';
    const dto = new CreateMultipleAttendanceDto();
    expect(await controller.update(id, dto)).toBeInstanceOf(AttendanceEntity);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove multiple attendances', async () => {
    const dto = new RemoveMultipleAttendanceDto();
    dto.ids = ['1'];
    expect(await controller.removeMultiple(dto)).toBe(1);
    expect(service.removeMultiple).toHaveBeenCalledWith(dto.ids);
  });
});
