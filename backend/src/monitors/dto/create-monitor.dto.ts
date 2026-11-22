import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

// 1. Khai báo Enum cho Method
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  HEAD = 'HEAD',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class CreateMonitorDto {
  @IsString({ message: 'Tên monitor phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên monitor không được để trống' })
  name: string;

  @IsUrl({}, { message: 'URL theo dõi không đúng định dạng (phải có http:// hoặc https://)' })
  @IsNotEmpty({ message: 'URL không được để trống' })
  url: string;

  //để tạm
  @IsString({ message: 'userId phải là chuỗi' })
  @IsNotEmpty({ message: 'userId không được để trống' })
  userId: string;

  @IsEnum(HttpMethod, { message: 'Method phải là một trong: GET, POST, HEAD, PUT, DELETE' })
  @IsOptional()
  method?: HttpMethod;

  @IsInt({ message: 'checkInterval phải là số nguyên (giây)' })
  @Min(10, { message: 'Khoảng thời gian ping tối thiểu là 10 giây' })
  @IsOptional()
  checkInterval?: number;

  @IsInt({ message: 'timeout phải là số nguyên (giây)' })
  @Min(1, { message: 'Timeout tối thiểu là 1 giây' })
  @Max(60, { message: 'Timeout tối đa là 60 giây' })
  @IsOptional()
  timeout?: number;
}