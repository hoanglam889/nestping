import { Injectable } from '@nestjs/common';
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

  create(createMonitorDto: CreateMonitorDto) { 
    return this.monitorRepo.save(createMonitorDto);
   }

  findAll() {
    return this.monitorRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} monitor`;
  }

  update(id: number, updateMonitorDto: UpdateMonitorDto) {
    return `This action updates a #${id} monitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitor`;
  }
}
