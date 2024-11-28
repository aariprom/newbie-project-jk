import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsSex } from './validator/sex.validator';
import { Sex, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

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

  constructor(partial: Partial<User>, isOwnerOrPublic: boolean) {
    Object.assign(this, partial);

    if (isOwnerOrPublic) {
      this.email = partial.email;
      this.age = partial.age;
      this.height = partial.height;
      this.weight = partial.weight;
      this.sex = partial.sex;
      this.level = partial.level;
    }
    delete this.privateProfile;
  }
}