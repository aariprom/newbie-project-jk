import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IsFoodType } from './validator/foodtype.validator';
import { FoodType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class searchFoodQueryDto {

  @ApiProperty({ description: 'Search food by name', required: false, example: 'Pizza' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Type of food to search for', required: false, example: 'VEGETABLE' })
  @IsString()
  @IsFoodType()
  @IsOptional()
  type?: FoodType;

  @ApiProperty({ description: 'Category ID (1-29)', required: false, example: 5 })
  @IsNumber()
  @Min(1)
  @Max(29)
  @IsOptional()
  category?: number;

  @ApiProperty({ description: 'Minimum calories', required: false, example: 100 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minCalories?: number;

  @ApiProperty({ description: 'Maximum calories', required: false, example: 500 })
  @IsNumber()
  @Max(999999)
  @IsOptional()
  maxCalories?: number;

  @ApiProperty({ description: 'Minimum protein content in grams', required: false, example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minProtein?: number;

  @ApiProperty({ description: 'Maximum protein content in grams', required: false, example: 50 })
  @IsNumber()
  @Max(999999)
  @IsOptional()
  maxProtein?: number;

  @ApiProperty({ description: 'Minimum carbohydrates content in grams', required: false, example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minCarbohydrates?: number;

  @ApiProperty({ description: 'Maximum carbohydrates content in grams', required: false, example: 100 })
  @IsNumber()
  @Max(999999)
  @IsOptional()
  maxCarbohydrates?: number;

  @ApiProperty({ description: 'Minimum fat content in grams', required: false, example: 1 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minFat?: number;

  @ApiProperty({ description: 'Maximum fat content in grams', required: false, example: 20 })
  @IsNumber()
  @Max(999999)
  @IsOptional()
  maxFat?: number;

  @ApiProperty({ description: 'Minimum sugars content in grams', required: false, example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minSugars?: number;

  @ApiProperty({ description: 'Maximum sugars content in grams', required: false, example: 15 })
  @IsNumber()
  @Max(999999)
  @IsOptional()
  maxSugars?: number;

  @ApiProperty({ description: 'Minimum sodium content in milligrams', required: false, example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minSodium?: number;

  @ApiProperty({ description: 'Maximum sodium content in milligrams', required: false, example: 500 })
  @IsNumber()
  @Max(999999)
  @IsOptional()
  maxSodium?: number;

  @ApiProperty({ description: 'User ID associated with the food items', required: false, example: 'user123' })
  @IsOptional()
  @Type(() => String)
  userId?: string;
}