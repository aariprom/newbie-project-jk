import { IsNumber } from 'class-validator';

export class StatDto {
  @IsNumber()
  calories: number;

  @IsNumber()
  carbohydrates: number;

  @IsNumber()
  fat: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  sugars: number;

  @IsNumber()
  sodium: number;

  constructor(partial: Partial<StatDto>) {
    Object.assign(this, partial);
  }
}