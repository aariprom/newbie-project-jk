import { IsNotEmpty, IsNumber } from 'class-validator';
import { Food } from '@prisma/client';

export class FoodResDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  calories: number;

  @IsNotEmpty()
  @IsNumber()
  carbohydrates: number;

  @IsNotEmpty()
  @IsNumber()
  protein: number;

  @IsNotEmpty()
  @IsNumber()
  fat: number;

  @IsNotEmpty()
  @IsNumber()
  sugars: number;

  @IsNotEmpty()
  @IsNumber()
  sodium: number;

  constructor(partial: Partial<Food>) {
    Object.assign(this, partial);
  }
}