import { Module } from '@nestjs/common';
import { MonitorChecksService } from './monitor-checks.service';
import { MonitorChecksController } from './monitor-checks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorChecks } from '../entities/entities/MonitorChecks';
import { Monitors } from '../entities/entities/Monitors';
import { MonitorCronService } from './monitor-cron.service';  
import { MonitorsModule } from '../monitors/monitors.module'; // 1. Import module vào

@Module({
  imports: [TypeOrmModule.forFeature([MonitorChecks, Monitors]), MonitorsModule],
  controllers: [MonitorChecksController],
  providers: [MonitorChecksService, MonitorCronService],
})
export class MonitorChecksModule {}
