import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UploadImagesReqDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'image files',
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  files: any[];
}
