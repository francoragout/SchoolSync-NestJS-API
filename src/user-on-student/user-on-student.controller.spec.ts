import { Test, TestingModule } from '@nestjs/testing';
import { UserOnStudentController } from './user-on-student.controller';
import { UserOnStudentService } from './user-on-student.service';

describe('UserOnStudentController', () => {
  let controller: UserOnStudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOnStudentController],
      providers: [UserOnStudentService],
    }).compile();

    controller = module.get<UserOnStudentController>(UserOnStudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
