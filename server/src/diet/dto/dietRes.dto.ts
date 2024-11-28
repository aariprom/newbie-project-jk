import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsDietType } from './validator/isDietType.validator';
import { Diet, DietType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class DietResDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsDietType()
  type: DietType;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return value.map((food: { foodId: number }) => food.foodId);
  })
  foods?: number[];

  constructor(partial: Partial<Diet>) {
    Object.assign(this, partial);
  }
}
