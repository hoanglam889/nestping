import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonitorChecksService } from './monitor-checks.service';
import { CreateMonitorCheckDto } from './dto/create-monitor-check.dto';
import { UpdateMonitorCheckDto } from './dto/update-monitor-check.dto';

@Controller('monitor-checks')
export class MonitorChecksController {
  constructor(private readonly monitorChecksService: MonitorChecksService) {}

  @Post()
  create(@Body() createMonitorCheckDto: CreateMonitorCheckDto) {
    return this.monitorChecksService.create(createMonitorCheckDto);
  }

  @Get()
  findAll() {
    return this.monitorChecksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitorChecksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitorCheckDto: UpdateMonitorCheckDto) {
    return this.monitorChecksService.update(+id, updateMonitorCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitorChecksService.remove(+id);
  }
}
