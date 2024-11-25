import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { IsFoodType } from './validator/foodtype.validator';
import { FoodType } from '@prisma/client';

export class createFoodDto {
  @IsString()
  name: string;

  @IsFoodType()
  @IsString()
  type: FoodType;

  @IsNumber()
  @IsOptional()
  category: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  calories?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  protein?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  carbohydrates?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  fat?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  sugars?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  sodium?: number
}