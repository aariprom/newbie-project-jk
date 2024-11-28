import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { UploadModule } from './upload/upload.module';
import { S3Service } from '../S3/s3.service';

@Module({
  providers: [PrismaService, UsersService, S3Service],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [UploadModule],
})
export class UsersModule {}
