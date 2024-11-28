import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PostService, PrismaService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
