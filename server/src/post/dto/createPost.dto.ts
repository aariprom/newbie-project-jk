import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
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
