import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StatDto {
  @ApiProperty({ description: 'Total calories', example: 250 })
  @IsNumber()
  calories: number;

  @ApiProperty({ description: 'Total carbohydrates in grams', example: 30 })
  @IsNumber()
  carbohydrates: number;

  @ApiProperty({ description: 'Total fat in grams', example: 10 })
  @IsNumber()
  fat: number;

  @ApiProperty({ description: 'Total protein in grams', example: 15 })
  @IsNumber()
  protein: number;

  @ApiProperty({ description: 'Total sugars in grams', example: 5 })
  @IsNumber()
  sugars: number;

  @ApiProperty({ description: 'Total sodium in milligrams', example: 200 })
  @IsNumber()
  sodium: number;

  constructor(partial: Partial<StatDto>) {
    Object.assign(this, partial);
  }
}