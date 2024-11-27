import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  pw: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

