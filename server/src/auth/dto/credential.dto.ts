import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class CredentialDto {
  @ApiProperty({ description: 'id', example: 'jk' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'password', example: 'pass' })
  @IsNotEmpty()
  @IsString()
  pw: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
