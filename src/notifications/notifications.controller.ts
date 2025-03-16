import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NotificationEntity } from './entities/notification.entity';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateNotificationDto })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return new NotificationEntity(
      await this.notificationsService.create(createNotificationDto),
    );
  }

  @Get('user/:userId')
  @ApiCreatedResponse({ type: CreateNotificationDto, isArray: true })
  async findByUserId(@Param('userId') userId: string) {
    const notifications = await this.notificationsService.findByUserId(userId);
    return notifications.map(
      (notification) => new NotificationEntity(notification),
    );
  }

  @Patch('user/:userId')
  @ApiOkResponse({ type: CreateNotificationDto, isArray: true })
  async updateMultipleByUserId(
    @Param('userId') userId: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    const result = await this.notificationsService.updateMultipleByUserId(
      userId,
      updateNotificationDto,
    );
    return result.count;
  }
}
