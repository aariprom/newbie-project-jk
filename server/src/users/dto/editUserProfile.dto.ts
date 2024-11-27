import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class EditUserProfileDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  age: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  height: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight: number;
}