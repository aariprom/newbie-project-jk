import { Injectable } from '@nestjs/common';
import { S3Service } from '../../S3/s3.service';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadUserProfileImage(file: Express.Multer.File): Promise<string> {
    const buffer = file.buffer; // Buffer containing file data
    const mimetype = file.mimetype; // MIME type of the file
    const folder = 'profile-pics'; // Define the folder name in S3

    // Use S3Service to upload the file
    return this.s3Service.uploadFile(buffer, folder, mimetype);
  }
}
