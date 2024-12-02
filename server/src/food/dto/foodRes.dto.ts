import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Food } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FoodResDto {

  @ApiProperty({ description: 'Unique identifier for the food item', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @ApiProperty({ description: 'Name of the food item', example: 'Pizza' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Calories in the food item', example: 250 })
  @IsNotEmpty()
  @IsNumber()
  calories!: number;

  @ApiProperty({ description: 'Carbohydrates in grams', example: 30 })
  @IsNotEmpty()
  @IsNumber()
  carbohydrates!: number;

  @ApiProperty({ description: 'Protein content in grams', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  protein!: number;

  @ApiProperty({ description: 'Fat content in grams', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  fat!: number;

  @ApiProperty({ description: 'Sugars content in grams', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  sugars!: number;

  constructor(partial: Partial<Food>) {
    Object.assign(this, partial);
  }
}