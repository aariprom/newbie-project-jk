import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsDietType } from './validator/isDietType.validator';
import { DietType } from '@prisma/client';

export class EditDietDto {
  @IsOptional()
  @IsArray()
  foods?: number[];

  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsDietType()
  type?: DietType;

  /*
  todo: maybe support editing date -> ask to overwrite if there already is diet in that date with same type
  @Transform(({ value }) => {
    const date = new Date(value); // Convert input to a Date object
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return date.toISOString(); // Convert to ISO format
  })
  @IsOptional()
  @IsDate()
  date?: Date;
  */
}