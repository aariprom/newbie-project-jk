import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto'
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, data: any) {
    const validationError = await validate(plainToInstance(data, CreatePostDto));
    if (validationError.length > 0) {
      console.log('[post.service] createPost() | validationError: ', validationError);
      throw new HttpException('Invalid input to create a new post', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.post.create({
      data: {
        ...data,
        createdDate: (new Date()).toISOString(),
        modifiedDate: (new Date()).toISOString(),
        user: {
          connect: {
            id: userId,
          }
        }
      }
    });
  }

  async deletePost(postId: number) {
    return this.prisma.post.delete({
      where: {
        id: postId,
      }
    });
  }

  async deletePostByUserId(userId: string) {
    return this.prisma.post.deleteMany({
      where: {
        userId: userId,
      },
    })
  }

  async getPostByUserId(userId: string) {
    return this.prisma.post.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getPostByPostId(postId: number) {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      }
    })
  }

  async editPost(data: any, postId: number) {
    const validated = plainToInstance(CreatePostDto, data);
    const validationErrors = await validate(validated);
    if (validationErrors.length > 0) {
      console.log('[post.service] editPost() | validationError: ', validationErrors);
      throw new HttpException('Invalid input to edit a post.', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.post.update({
      data: {
        ...data,
        modifiedDate: (new Date()).toISOString(),
      },
      where: {
        id: postId,
      }
    })
  }
}
