import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto'
import { PrismaService } from '../prisma.service';
import { EditPostDto } from './dto/editPost.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, data: CreatePostDto) {
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
        id: Number(postId),
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
        id: Number(postId),
      }
    })
  }

  async editPost(postId: number, data: EditPostDto) {
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
