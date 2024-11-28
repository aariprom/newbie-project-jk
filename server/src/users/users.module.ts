import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { UploadModule } from '../upload/upload.module';
import { S3Service } from '../S3/s3.service';

@Module({
  providers: [PrismaService, UserService, S3Service],
  exports: [UserService],
  controllers: [UsersController],
  imports: [UploadModule],
})
export class UsersModule {}
