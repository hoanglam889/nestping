import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonitorCheckDto } from './dto/create-monitor-check.dto';
import { UpdateMonitorCheckDto } from './dto/update-monitor-check.dto';
import { MonitorChecks } from '../entities/entities/MonitorChecks';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Monitors } from '../entities/entities/Monitors';
import axios from 'axios';
import { MonitorsService } from '../monitors/monitors.service';
@Injectable()
export class MonitorChecksService {
  constructor(
      @InjectRepository(MonitorChecks)
      private readonly monitor_checkRepo: Repository<MonitorChecks>,

      @InjectRepository(Monitors)
      private readonly monitorRepo: Repository<Monitors>,

      private readonly monitorsService: MonitorsService,
    ) {}  
      //Hàm xử lý gửi request check website
      async checkMonitor(monitor: Monitors) {
        const startTime = Date.now();
        try {
          const response = await axios.get(monitor.url, {
            //axios sẽ nhận về kiểu này            
            //{
            //   data: {
            //     userId: 1,
            //     id: 1,
            //     title: "sunt aut facere...",
            //     body: "quia et suscipit..."
            //   },

            //   status: 200, 
            //   statusText: "OK",

            //   headers: {
            //     "content-type": "application/json; charset=utf-8"
            //   },

            //   config: { /* cấu hình request */ },
            //   request: { /* thông tin request */ }
            // }
          timeout: (monitor.timeout ?? 10) * 1000,
          validateStatus: () => true,
        });
        return {
          status: (response.status >= 200 && response.status < 400
            ? 'SUCCESS'
            : 'FAILURE') as 'SUCCESS' | 'FAILURE',
          httpStatusCode: response.status,
          responseTimeMs: Date.now() - startTime,
          errorType: null as string | null,
          errorMessage: null as string | null,
        }
      }
      catch (error) {
        return {
          status: 'FAILURE' as const,
          httpStatusCode: null,
          responseTimeMs: Date.now() - startTime,
          errorType: 'REQUEST_ERROR',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
    

    
  async create(monitorId: string) {
    const monitor = await this.monitorRepo.findOneBy({id: monitorId});
          if(!monitor)
          {
            throw  new NotFoundException ('Không tìm được Monitor này');
          }
           const checkResult = await this.checkMonitor(monitor);

           const newMonitorCheck = this.monitor_checkRepo.create({
            monitorId: monitor.id,
            checkedAt: new Date(),
            status: checkResult.status,
            httpStatusCode: checkResult.httpStatusCode ?? null,
            responseTimeMs: checkResult.responseTimeMs ?? null,
            errorType: checkResult.errorType ?? null,
            errorMessage: checkResult.errorMessage ?? null,
          });
          //Gọi updateStatusAfterCheck từ monitor.service
          await this.monitorsService.updateStatusAfterCheck(monitor.id, checkResult.status);
    return await this.monitor_checkRepo.save(newMonitorCheck);
  }

  //Hàm tìm tất cả Monitor_check của 1 Monitor
  async findAll(monitorId?: string, limit: number = 50) {
    return await this.monitor_checkRepo.find({
    where: monitorId ? { monitorId } : {},
    order: { checkedAt: 'DESC' }, // Lấy cái mới nhất lên đầu
    take: limit,                   // Giới hạn số lượng (mặc định 50 cái gần nhất)
  });
  }

  async findOne(id: string) {

    return await this.monitor_checkRepo.findOneBy({id});
  }

  //Hàm này chưa cần
  update(id: number, updateMonitorCheckDto: UpdateMonitorCheckDto) {
    return `This action updates a #${id} monitorCheck`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitorCheck`;
  }
}
