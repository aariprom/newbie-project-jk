import {
  Controller, Get, Post, Delete, Body, Param, UseInterceptors,
  ParseIntPipe, BadRequestException, UploadedFiles, Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { User } from '@prisma/client';
import { CreatePostDto } from './dto/createPost.dto';
import { EditPostDto } from './dto/editPost.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { Public } from 'src/auth/public.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadImagesReqDto } from './dto/uploadImagesReq.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,
              private readonly uploadService: UploadService,) {}

  @Post()
  async createPost(@CurrentUser() user: User, @Body() body: CreatePostDto) {
    return this.postService.createPost(user.id, body);
  }

  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }

  /* call POST / -> retrieve postId from response ->
     call POST /:postId/upload-image -> post is uploaded */
  @Post('/:postId/upload-image')
  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files', 10, {
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload multiple images',
    type: UploadImagesReqDto,
  })
  async uploadPostImages(@UploadedFiles() files: Express.Multer.File[], @Param('postId', ParseIntPipe) postId: number) {
    if (!files || files.length === 0) {
      console.log(files);
      throw new BadRequestException('No files uploaded');
    }
    const urls = await this.uploadService.uploadPostImages(files);
    console.log(urls);
    return this.postService.linkPicToPost(urls, postId);
  }

  @Delete('/deleteAll')
  async deleteAll(@CurrentUser() user: User) {
    return this.postService.deletePostByUserId(user.id);
  }

  @Patch('/edit/:postId')
  async editPost(@Param('postId') postId: number, @Body() body: EditPostDto) {
    return this.postService.editPost(postId, body);
  }

  @Get('/:postId')
  @Public()
  async getPost(@Param('postId') postId: number) {
    return this.postService.getPostByPostId(postId);
  }

}
