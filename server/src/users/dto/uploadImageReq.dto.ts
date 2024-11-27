import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadImageReqDto {
  @ApiProperty({
    description: 'image file',
  })
  @IsNotEmpty()
  @Type(() => String)
  file: any;
}
