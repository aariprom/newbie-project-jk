import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PostIdDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  postId: number;
}