import { IsOptional, IsNumber, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { IsFoodType } from '../validator/foodtype.validator';
import { FoodType } from '@prisma/client';

export class searchFoodRequestQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsFoodType()
  @IsOptional()
  type?: FoodType;

  @IsNumber()
  @Min(1)
  @Max(29)
  @IsOptional()
  @Type(() => Number)
  category?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minCalories is at least 0
  minCalories?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxCalories?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minProtein is at least 0
  minProtein?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxProtein?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minCarbohydrates is at least 0
  minCarbohydrates?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxCarbohydrates?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minFat is at least 0
  minFat?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxFat?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minSugars is at least 0
  minSugars?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxSugars?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minSodium is at least 0
  minSodium?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxSodium?: number;

  @IsOptional()
  @Type(() => String)
  userId?: string;
}