import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IsFoodType } from './validator/foodtype.validator';
import { FoodType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class searchFoodQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsFoodType()
  @IsOptional()
  type?: FoodType;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @Max(29)
  @IsOptional()
  @Type(() => Number)
  category?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minCalories is at least 0
  minCalories?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(999999)
  maxCalories?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minProtein is at least 0
  minProtein?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(999999)
  maxProtein?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minCarbohydrates is at least 0
  minCarbohydrates?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(999999)
  maxCarbohydrates?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minFat is at least 0
  minFat?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(999999)
  maxFat?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minSugars is at least 0
  minSugars?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(999999)
  maxSugars?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)  // Ensure minSodium is at least 0
  minSodium?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(999999)
  maxSodium?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  userId?: string;
}