import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { MonitorChecksService } from './monitor-checks.service';

@Controller('monitor-checks')
export class MonitorChecksController {
  constructor(private readonly monitorChecksService: MonitorChecksService) {}

  // POST /monitor-checks/:monitorId — trigger check thủ công cho 1 monitor
  @Post(':monitorId')
  create(@Param('monitorId') monitorId: string) {
    return this.monitorChecksService.create(monitorId);
  }

  @Get()
  findAll(@Query('monitorId') monitorId?: string) {
    return this.monitorChecksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitorChecksService.findOne(id);
  }
}
