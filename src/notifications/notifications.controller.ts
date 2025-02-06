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

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateNotificationDto })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiCreatedResponse({ type: CreateNotificationDto, isArray: true })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CreateNotificationDto })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreateNotificationDto })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CreateNotificationDto })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
