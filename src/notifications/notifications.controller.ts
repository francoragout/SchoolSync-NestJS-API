import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  @Get()
  @ApiCreatedResponse({ type: CreateNotificationDto, isArray: true })
  async findAll() {
    const notifications = await this.notificationsService.findAll();
    return notifications.map(
      (notification) => new NotificationEntity(notification),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: CreateNotificationDto })
  async findOne(@Param('id') id: string) {
    return new NotificationEntity(await this.notificationsService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreateNotificationDto })
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return new NotificationEntity(
      await this.notificationsService.update(id, updateNotificationDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: CreateNotificationDto })
  async remove(@Param('id') id: string) {
    return new NotificationEntity(await this.notificationsService.remove(id));
  }
}
