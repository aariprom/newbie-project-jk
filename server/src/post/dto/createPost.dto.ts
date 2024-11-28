import { IsArray, IsNotEmpty, IsOptional, IsString, } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
