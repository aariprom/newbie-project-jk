import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  }

  /**
   * Upload a file to S3 and return its URL.
   * @param file Buffer (File data)
   * @param folder string (Target folder in S3)
   * @param mimetype string (File MIME type)
   */
  async uploadFile(file: Buffer, folder: string, mimetype: string): Promise<string> {
    const fileName = `${folder}/${uuidv4()}`; // Generate unique file name
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file,
          ContentType: mimetype,
        }),
      );
      return `https://${this.bucketName}.s3.${this.configService.get<string>(
        'S3_REGION',
      )}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Error uploading file to S3', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  /**
   * Download a file from S3 and save it locally.
   * @param key string (S3 key of the file to download)
   * @param downloadPath string (Local path to save the file)
   * @returns string (Local file path of the downloaded file)
   */
  async downloadFile(key: string, downloadPath: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new InternalServerErrorException('File not found in S3');
      }

      const dir = path.dirname(downloadPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const filePath = path.resolve(downloadPath, path.basename(key));
      const fileStream = fs.createWriteStream(filePath);

      // Pipe the response body to the file stream
      (response.Body as Readable).pipe(fileStream);

      // Wait for the file to finish writing
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });

      return filePath;
    } catch (error) {
      console.error('Error downloading file from S3', error);
      throw new InternalServerErrorException('Failed to download file from S3');
    }
  }
}
