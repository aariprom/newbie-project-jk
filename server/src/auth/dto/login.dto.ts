import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'id', example: 'jk' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'password', example: 'pass' })
  @IsNotEmpty()
  @IsString()
  pw: string;
}
