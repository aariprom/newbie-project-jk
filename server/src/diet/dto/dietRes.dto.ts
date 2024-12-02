import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsDietType } from './validator/isDietType.validator';
import { Diet, DietType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { FoodResDto } from '../../food/dto/foodRes.dto';

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
    return value.map((food: { id: number, name: string }) => new FoodResDto(food));
  })
  foods?: Partial<FoodResDto>[];

  constructor(partial: Partial<Diet>) {
    Object.assign(this, partial);
  }
}
