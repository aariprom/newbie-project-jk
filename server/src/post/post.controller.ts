import { Controller, Get, Post, Delete, Req, Body, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as P, User } from '@prisma/client';
import { CreatePostDto } from './dto/createPost.dto';
import { EditPostDto } from './dto/editPost.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@CurrentUser() user: User, @Body() body: CreatePostDto): Promise<P> {
    return this.postService.createPost(user.id, body);
  }

  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }

  /* todo: is this really needed? */
  @Delete('/deleteAll')
  async deleteAll(@CurrentUser() user: User) {
    return this.postService.deletePostByUserId(user.id);
  }

  @Post('/edit/:postId')
  async editPost(@Param('postId') postId: number, @Body() body: EditPostDto) {
    return this.postService.editPost(postId, body);
  }

  @Get('/:postId')
  async read(@Param('postId') postId: number) {
    return this.postService.getPostByPostId(postId);
  }

  /* todo: make an API for searching post, integrate this to that */
  /*@Get('/:userId')
  async readById(@Param('userId') userId: string) {
    return this.postService.getPostByUserId(userId);
  }*/

}
