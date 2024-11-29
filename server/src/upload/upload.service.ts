import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Service } from './S3/s3.service';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadUserProfileImage(file: Express.Multer.File) {
    const buffer = file.buffer; // Buffer containing file data
    const mimetype = file.mimetype; // MIME type of the file
    const folder = 'profile-pics'; // Define the folder name in S3

    // Use S3Service to upload the file
    return this.s3Service.uploadFile(buffer, folder, mimetype);
  }

  async uploadPostImages(files: Express.Multer.File[]) {
    const folder = 'post-pics';
    try {
      const uploadPromises = files.map(file => {
        const buffer = file.buffer;
        const mimetype = file.mimetype;
        return this.s3Service.uploadFile(buffer, folder, mimetype);
      });
      // each upload should be concurrent
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files to S3', error);
      throw new InternalServerErrorException('Failed to upload files to S3');
    }
  }
}
