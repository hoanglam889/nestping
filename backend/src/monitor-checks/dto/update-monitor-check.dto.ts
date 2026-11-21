import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitorCheckDto } from './create-monitor-check.dto';

export class UpdateMonitorCheckDto extends PartialType(CreateMonitorCheckDto) {}
