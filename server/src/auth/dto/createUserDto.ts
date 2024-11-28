import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createUserDto {

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

