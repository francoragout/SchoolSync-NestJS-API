import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationEntity } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn().mockResolvedValue(new NotificationEntity()),
            findByUserId: jest
              .fn()
              .mockResolvedValue([new NotificationEntity()]),
            updateMultipleByUserId: jest.fn().mockResolvedValue({ count: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a notification', async () => {
    const dto = new CreateNotificationDto();
    expect(await controller.create(dto)).toBeInstanceOf(NotificationEntity);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of notifications by user ID', async () => {
    const userId = '1';
    expect(await controller.findByUserId(userId)).toBeInstanceOf(Array);
    expect(service.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('should update multiple notifications by user ID', async () => {
    const userId = '1';
    const dto = new CreateNotificationDto();
    expect(await controller.updateMultipleByUserId(userId, dto)).toBe(1);
    expect(service.updateMultipleByUserId).toHaveBeenCalledWith(userId, dto);
  });
});
