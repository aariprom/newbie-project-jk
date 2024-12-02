import { IsOptional, IsNumber, Min, IsString, Max } from 'class-validator';
import { IsFoodType } from './validator/foodtype.validator';
import { FoodType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class createFoodDto {
  @ApiProperty({ description: 'Name of the food item', example: 'Pizza' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type of food', example: 'VEGETABLE' })
  @IsFoodType()
  @IsString()
  type: FoodType;

  @ApiProperty({ description: 'Category ID (1-29)', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(29)
  @Type(() => Number)
  category?: number;

  @ApiProperty({ description: 'Calories in the food item', example: 250, required: false })
  @IsNumber()
  @IsOptional()
  @Max(999999)
  @Min(0)
  @Type(() => Number)
  calories?: number;

  @ApiProperty({ description: 'Protein content in grams', example: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Max(999999)
  @Min(0)
  @Type(() => Number)
  protein?: number;

  @ApiProperty({ description: 'Carbohydrates content in grams', example: 30, required: false })
  @IsNumber()
  @IsOptional()
  @Max(999999)
  @Min(0)
  @Type(() => Number)
  carbohydrates?: number;

  @ApiProperty({ description: 'Fat content in grams', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Max(999999)
  @Min(0)
  @Type(() => Number)
  fat?: number;

  @ApiProperty({ description: 'Sugars content in grams', example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Max(999999)
  @Min(0)
  @Type(() => Number)
  sugars?: number;

  @ApiProperty({ description: 'Sodium content in milligrams', example: 200, required: false })
  @IsNumber()
  @IsOptional()
  @Max(999999)
  @Min(0)
  @Type(() => Number)
  sodium?: number;
}