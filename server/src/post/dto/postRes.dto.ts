import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { Post } from '@prisma/client';
import { FoodResDto } from '../../food/dto/foodRes.dto';

export class PostResDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  title: string;

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

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return value.map(((food: { food: { id: number, name: string } }) => new FoodResDto({ id: food.food.id, name:food.food.name })));
  })
  foods;

  constructor(partial: Partial<Post>) {
    return Object.assign(this, partial);
  }
}
