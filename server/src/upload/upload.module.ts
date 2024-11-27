import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { S3Module } from '../S3/s3.module';
import { S3Service } from '../S3/s3.service';

@Module({
  imports: [S3Module],
  providers: [S3Service, UploadService],
  exports: [UploadService, S3Service],
})
export class UploadModule {}
