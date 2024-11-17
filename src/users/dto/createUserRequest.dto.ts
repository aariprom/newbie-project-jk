import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createUserRequestDTO {

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

