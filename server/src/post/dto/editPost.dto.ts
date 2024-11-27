import { IsOptional, IsString } from 'class-validator';

export class EditPostDto {
  @IsOptional()
  @IsString()
  content?: string;
}