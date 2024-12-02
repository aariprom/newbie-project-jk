import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class IsPostedDto {
  @IsBoolean()
  exists: boolean;

  @IsNumber()
  @IsOptional()
  postId: number;

  constructor(partial: Partial<IsPostedDto>) {
    Object.assign(this, partial);
  }
}