import { Injectable } from '@nestjs/common';
import { CreateMonitorCheckDto } from './dto/create-monitor-check.dto';
import { UpdateMonitorCheckDto } from './dto/update-monitor-check.dto';

@Injectable()
export class MonitorChecksService {
  create(createMonitorCheckDto: CreateMonitorCheckDto) {
    return 'This action adds a new monitorCheck';
  }

  findAll() {
    return `This action returns all monitorChecks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monitorCheck`;
  }

  update(id: number, updateMonitorCheckDto: UpdateMonitorCheckDto) {
    return `This action updates a #${id} monitorCheck`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitorCheck`;
  }
}
