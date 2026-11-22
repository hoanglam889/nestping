import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'; 

export class CreateUserDto {
    @IsString({ message: 'Tên phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
    
    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
    password: string;
}
