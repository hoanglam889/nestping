import { Module } from '@nestjs/common';
import { MonitorChecksService } from './monitor-checks.service';
import { MonitorChecksController } from './monitor-checks.controller';

@Module({
  controllers: [MonitorChecksController],
  providers: [MonitorChecksService],
})
export class MonitorChecksModule {}
