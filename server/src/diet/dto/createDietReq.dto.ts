import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsDietType } from './validator/isDietType.validator';
import { DietType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateDietReqDto {
  @IsNotEmpty()
  @IsArray()
  foods: number[];

  @IsOptional()
  @IsString()
  memo?: string;

  @IsNotEmpty()
  @IsDietType()
  type: DietType;


  @Transform(({ value }) => {
    const date = new Date(value); // Convert input to a Date object
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return date.toISOString(); // Convert to ISO format
  })
  @IsDate()
  date: Date;
}