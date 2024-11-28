import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsSex } from './validator/sex.validator';
import { Sex, User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserResDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsSex()
  sex: Sex;

  @IsOptional()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsDate()
  createdDate: Date;

  @Expose()
  @IsOptional()
  @IsString()
  profilePicUrl: string;

  privateProfile: boolean;

  constructor(partial: Partial<User>, isOwner: boolean, isPrivate: boolean) {
    Object.assign(this, partial);

    if (!isOwner) {
      delete this.privateProfile;
      delete this.createdDate;
    }

    if (!isOwner && isPrivate) {
      delete this.email;
      delete this.age;
      delete this.height;
      delete this.weight;
      delete this.sex;
      delete this.level;
    }
  }
}
