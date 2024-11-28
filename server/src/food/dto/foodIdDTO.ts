import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FoodIdDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  foodId: number;
}