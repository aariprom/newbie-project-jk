import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaService } from '../prisma.service';
import { EditPostDto } from './dto/editPost.dto';
import { PostResDto } from './dto/postRes.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, dietId: number, data: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        ...data,
        createdDate: (new Date()).toISOString(),
        modifiedDate: (new Date()).toISOString(),
        user: {
          connect: {
            id: userId,
          }
        },
        diet: {
          connect: {
            id: dietId,
          }
        }
      },
      select: {
        id: true,
        userId: true,
        content: true,
        createdDate: true,
        modifiedDate: true,
        pictures: {
          select: {
            url: true,
          }
        },
        diet: {
          select: {
            id: true,
            type: true,
            date: true,
            foods: {
              select: {
                food: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    });
    return new PostResDto(post);
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

  async linkPicToPost(urls: string[], postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      }
    });
    if (!post) {
      throw new BadRequestException('No post found.');
    }
    return this.prisma.picture.createMany({
      data: urls.map((url) => ({
        url: url,
        postId: postId,
      })),
      skipDuplicates: true,
    });
  }
  
  async getPostByUserId(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        content: true,
        createdDate: true,
        modifiedDate: true,
        pictures: {
          select: {
            url: true,
          }
        }
      },
    });
    if (!posts) {
      return null;
    }
    return (posts.map(post => new PostResDto(post)));
  }

  async getPostByPostId(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdDate: true,
        modifiedDate: true,
        pictures: {
          select: {
            url: true,
          },
        },
        diet: {
          select: {
            foods: {
              select: {
                food: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        }
      },
    });
    if (!post) {
      throw new BadRequestException('No post found');
    }
    return new PostResDto(post);
  }

  async editPost(postId: number, data: EditPostDto) {
    const post = await this.prisma.post.update({
      data: {
        ...data,
        modifiedDate: (new Date()).toISOString(),
      },
      where: {
        id: postId,
      },
      select: {
        id: true,
        userId: true,
        content: true,
        createdDate: true,
        modifiedDate: true,
        pictures: {
          select: {
            url: true,
          }
        }
      },
    });
    return new PostResDto(post);
  }
}
