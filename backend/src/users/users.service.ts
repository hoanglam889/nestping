import { Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from '../entities/entities/Users';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(Users)
      private readonly userRepo: Repository<Users>,
    ) {} 
    //createUserDto là biến dự theo bộ quy tắc mình đã khai báo CreateUserDto (ở create DTO)
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOneBy({email: createUserDto.email});
    if(existingUser) {
      throw new ConflictException('Email already exists');
    }
    const newUser = this.userRepo.create(createUserDto);
    return await this.userRepo.save(newUser);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    //findOne này dùng của hàm ở trên
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy User với ID: ${id}`); // Trả về HTTP 404
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailTaken = await this.userRepo.findOneBy({ email: updateUserDto.email });
      if (emailTaken) {
        throw new ConflictException('Email mới đã được người khác sử dụng!');
      }
    }
    //Thay existingUser(data cũ) bằng updateUserDto
    Object.assign(existingUser, updateUserDto);
    // 4. Lưu lại (TypeORM tự biết đây là lệnh UPDATE vì user đã có sẵn id)
    return await this.userRepo.save(existingUser);;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
