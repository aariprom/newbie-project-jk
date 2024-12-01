import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePostDto {
  /*@ApiProperty({ description: "Id of the target diet", example: "21" })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  dietId: number;*/

  @ApiProperty({ description: "A new post with this name", example: "title" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "true or false", example: "true" })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: "A new post with this content", example: "content" })
  @IsOptional()
  @IsString()
  content?: string;
}
