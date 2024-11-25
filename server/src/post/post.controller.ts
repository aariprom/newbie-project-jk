import { Controller, Get, Post, Delete, Req, Body, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as P } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createPost(@Req() req: any, @Body() body: any): Promise<P> {
    const payload = await req['payload'];
    const userId = payload.userId;
    return this.postService.createPost(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:postId')
  async deletePost(@Req() req: any, @Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteAll')
  async deleteAll(@Req() req: any) {
    const payload = await req['payload'];
    const userId = payload.userId;
    return this.postService.deletePostByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit/:postId')
  async editPost(@Param('postId') postId: number, @Body() body: any) {
    return this.postService.editPost(body, postId);
  }

  @Get('/read/:postId')
  async read(@Param('postId') postId: number) {
    return this.postService.getPostByPostId(postId);
  }

  @Get('/read/:userId')
  async readById(@Param('userId') userId: string) {
    return this.postService.getPostByUserId(userId);
  }

}
