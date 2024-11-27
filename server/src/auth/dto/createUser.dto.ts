import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ description: "id", example: "jk" })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: "password" })
  @IsNotEmpty()
  @IsString()
  pw: string;

  @ApiProperty({ description: "email", example: "jk@sparcs.org" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

