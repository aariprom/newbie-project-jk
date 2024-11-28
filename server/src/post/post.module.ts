import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from '../prisma.service';
import { UploadModule } from '../upload/upload.module';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [UploadModule],
  providers: [PostService, PrismaService, UploadService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
