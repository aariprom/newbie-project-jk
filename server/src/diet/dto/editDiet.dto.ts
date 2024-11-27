import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { IsDietType } from './validator/isDietType.validator';
import { DietType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class EditDietDto {
  @ApiProperty({ description: "Array of id of foods belong to this diet.", example: "[1, 22, 30]" })
  @IsOptional()
  @IsArray()
  foods?: number[];

  @ApiProperty({ description: "Optional memo about this diet.", example: "memo" })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiProperty({ description: "BREAKFAST | LUNCH | DINNER | OTHERS", example: "BREAKFAST" })
  @IsOptional()
  @IsDietType()
  type?: DietType;

  @ApiProperty({ description: "YYYY-MM-DD", example: "2024-12-02" })
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
}