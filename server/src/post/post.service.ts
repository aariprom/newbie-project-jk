import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
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
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      }
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    } else {
      await this.prisma.post.delete({
        where: {
          id: postId,
        }
      })
    }
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
        isPublic: true,
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
            },
            type: true,
            date: true,
          }
        }
      },
    });
    if (!post) {
      return null;
    }
    return new PostResDto(post);
  }

  async editPost(postId: number, data: EditPostDto) {
    console.log(postId, data);
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

  async getPost() {
    const posts = await this.prisma.post.findMany({
      where: {
        isPublic: true,
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
            },
            type: true,
            date: true,
          }
        }
      },
    });
    return posts.map(post => new PostResDto(post));
  }
}
