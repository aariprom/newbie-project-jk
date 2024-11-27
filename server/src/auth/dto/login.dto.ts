import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'id', example: 'test' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'password', example: 'pass' })
  @IsNotEmpty()
  @IsString()
  pw: string;
}