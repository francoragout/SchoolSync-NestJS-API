import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomsService } from './classrooms.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

describe('ClassroomsService', () => {
  let service: ClassroomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassroomsService, PrismaService, NotificationsService],
    }).compile();

    service = module.get<ClassroomsService>(ClassroomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
