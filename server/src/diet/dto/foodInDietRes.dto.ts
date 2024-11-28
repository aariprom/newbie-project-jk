import { IsNotEmpty, IsNumber } from 'class-validator';
import { FoodsInDiet } from '@prisma/client';

export class FoodInDietResDto {
  @IsNotEmpty()
  @IsNumber()
  dietId: number;

  @IsNotEmpty()
  @IsNumber()
  foodId: number;

  constructor(partial: Partial<FoodsInDiet>) {
    Object.assign(this, partial);
  }
}