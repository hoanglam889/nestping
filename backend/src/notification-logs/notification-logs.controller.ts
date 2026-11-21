import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationLogsService } from './notification-logs.service';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { UpdateNotificationLogDto } from './dto/update-notification-log.dto';

@Controller('notification-logs')
export class NotificationLogsController {
  constructor(private readonly notificationLogsService: NotificationLogsService) {}

  @Post()
  create(@Body() createNotificationLogDto: CreateNotificationLogDto) {
    return this.notificationLogsService.create(createNotificationLogDto);
  }

  @Get()
  findAll() {
    return this.notificationLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationLogDto: UpdateNotificationLogDto) {
    return this.notificationLogsService.update(+id, updateNotificationLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationLogsService.remove(+id);
  }
}
