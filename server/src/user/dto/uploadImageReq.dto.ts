import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadImageReqDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'An image file for profile pic.',
  })
  @IsNotEmpty()
  file: any;
}
