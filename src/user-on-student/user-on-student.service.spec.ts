import { Test, TestingModule } from '@nestjs/testing';
import { UserOnStudentService } from './user-on-student.service';

describe('UserOnStudentService', () => {
  let service: UserOnStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOnStudentService],
    }).compile();

    service = module.get<UserOnStudentService>(UserOnStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
