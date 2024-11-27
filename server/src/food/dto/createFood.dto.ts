import { IsOptional, IsNumber, Min, IsString, Max } from 'class-validator';
import { IsFoodType } from './validator/foodtype.validator';
import { FoodType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class createFoodDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsFoodType()
  @IsString()
  type: FoodType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(29)
  category: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  calories?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  protein?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  carbohydrates?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  fat?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  sugars?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  sodium?: number
}