import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { Monitors } from '../entities/entities/Monitors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MonitorsService {
  constructor(
    @InjectRepository(Monitors)
    private readonly monitorRepo: Repository<Monitors>,
  ) {}  

//Hàm thêm mới Monitor
  async create(createMonitorDto: CreateMonitorDto) { 
    const newMonitor = this.monitorRepo.create(createMonitorDto);
     return await this.monitorRepo.save(newMonitor);
   }
//Hàm GET Monitor
  async findAll() {
    return await this.monitorRepo.find();
  }

  findOne(id: string) {
    return this.monitorRepo.findOneBy({id});
  }

//Hàm PATCH cho monitor
  async update(id: string, updateMonitorDto: UpdateMonitorDto) {
    const exitstingMonitor = await this.monitorRepo.findOneBy({id});
    if(!exitstingMonitor) {
      throw new NotFoundException(`Không tìm thấy Monitor với ID: ${id}`); // Trả về HTTP 404
    }
    if(updateMonitorDto.userId) {
      throw new BadRequestException (`Không được phép thay đổi id của tài khoản người dùng`);
    }
    Object.assign(exitstingMonitor, updateMonitorDto);

    return await this.monitorRepo.save(exitstingMonitor);
  }

  async remove(id: string) {
  const monitor = await this.findOne(id);
  if (!monitor) {
    throw new NotFoundException(`Không tìm thấy Monitor với ID: ${id}`);
  }
  return await this.monitorRepo.remove(monitor);
}


async togglePause(id: string) {
  const monitor = await this.monitorRepo.findOneBy({ id });
  if (!monitor) {
    throw new NotFoundException(`Không tìm thấy Monitor với ID: ${id}`);
  }

  // Nếu đang PAUSED thì resume về UP, ngược lại thì PAUSE
  monitor.status = monitor.status === 'PAUSED' ? 'UP' : 'PAUSED';

  return await this.monitorRepo.save(monitor);
}


//Hàm update thông tin sau khi tạo bản ghi 
async updateStatusAfterCheck(id: string, status: 'SUCCESS' | 'FAILURE' ) {
  const monitor = await this.monitorRepo.findOneBy({id});
  if (!monitor) return null;

  if(status === 'SUCCESS') {
    //ép monitor.consecutiveSuccesses về int rồi + 1
      monitor.consecutiveSuccesses = (Number(monitor.consecutiveSuccesses) || 0) + 1;
      //thành công rồi thì ngắt chuỗi thất bại
      monitor.consecutiveFailures = 0;
      monitor.status = 'UP';
  } else {
      monitor.consecutiveFailures = (Number(monitor.consecutiveFailures) || 0) + 1;
      monitor.consecutiveSuccesses = 0;
      monitor.status = 'DOWN';
    }
    monitor.lastCheckedAt = new Date();
    monitor.nextCheckAt = new Date(
      Date.now() + (monitor.checkInterval ?? 60) * 1000
    );

    return await this.monitorRepo.save(monitor);
}
}
