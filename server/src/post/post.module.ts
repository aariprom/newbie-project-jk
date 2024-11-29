import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
