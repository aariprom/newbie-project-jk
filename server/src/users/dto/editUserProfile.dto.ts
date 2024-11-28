import { IsNumber, IsOptional, IsUrl, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsSex } from './validator/sex.validator';
import { Sex } from '@prisma/client';

export class EditUserProfileDto {
  @ApiProperty({ description: "Age setting of the user.", example: "21" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  age?: number;

  @ApiProperty({ description: "Height setting of the user in cm.", example: "170" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  height?: number;

  @ApiProperty({ description: "Weight setting of the user.", example: "65" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight?: number;

  @ApiProperty({ description: "Level of daily workout, between 1 to 5.", example: "3" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  level?: number;

  @ApiProperty({ description: "Sex. M or F", example: "M" })
  @IsOptional()
  @IsSex()
  sex?: Sex;

  @ApiProperty({ description: "url of profile pic, but user would never touch this", })
  @IsOptional()
  @IsUrl()
  profilePicUrl?: string;
}
