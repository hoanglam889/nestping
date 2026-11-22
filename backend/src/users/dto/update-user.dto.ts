import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

//extends PartialType(CreateUserDto) là biến các field đó thành optional (không bắt buộc - cú pháp PartialType).
export class UpdateUserDto extends PartialType(CreateUserDto) {}