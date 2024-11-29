import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  }

  /**
   * 파일을 S3에 업로드하고 URL 반환
   * @param file Buffer (파일 데이터)
   * @param folder string (저장 폴더 이름)
   * @param mimetype string (파일의 MIME 타입)
   */
  async uploadFile(
    file: Buffer,
    folder: string,
    mimetype: string,
  ): Promise<string> {
    const fileName = `${folder}/${uuidv4()}`; // 고유한 파일 이름 생성
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
}