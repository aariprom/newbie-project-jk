import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Post } from '@prisma/client';

export class PostResDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsDate()
  createdDate: Date;

  @IsOptional()
  @IsDate()
  modifiedDate: Date;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return value.map(((picture: { url: string; }) => picture.url))
  })
  pictures: string[];

  constructor(partial: Partial<Post>) {
    return Object.assign(this, partial);
  }
}