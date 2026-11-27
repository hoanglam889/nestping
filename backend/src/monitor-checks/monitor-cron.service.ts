import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Monitors } from '../entities/entities/Monitors';
import { MonitorChecksService } from '../monitor-checks/monitor-checks.service';

@Injectable()
export class MonitorCronService {
  constructor(
    @InjectRepository(Monitors)
    private monitorRepo: Repository<Monitors>,

    private monitorChecksService: MonitorChecksService,
  ) {}
//10s check 1 lần
  @Cron('*/10 * * * * *')
  async handleCron() {
    const monitors = await this.monitorRepo.find();
    for(const monitor of monitors) {
      //status là PAUSE thì cho cút
      if(monitor.status === 'PAUSED') {
        continue;
      }
      //nextCheckAt null thì lấy giờ hiện hành, nếu chưa tới monitor.nextCheckAt thì cho cút
       const now = new Date();
      if((monitor.nextCheckAt ?? now) > now ) {
        continue;
      }

      // đến hạn thì tạo monitor_checks
      await this.monitorChecksService.create(monitor.id);
    }

    
    console.log('Cron is running and created data');
  }
}