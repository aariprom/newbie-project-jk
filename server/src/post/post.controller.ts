import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { User } from '@prisma/client';
import { CreatePostDto } from './dto/createPost.dto';
import { EditPostDto } from './dto/editPost.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { Public } from 'src/auth/public.decorator';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { UploadImagesReqDto } from './dto/uploadImagesReq.dto';
import { ApiCommonErrorResponse } from '../swagger-common-response.decorator';
import { PostResDto } from './dto/postRes.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,
              private readonly uploadService: UploadService,) {}

  @Post('/:dietId')
  @ApiResponse({ status: 201, description: 'Successfully created a post item.', type: PostResDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. ' })
  async createPost(@CurrentUser() user: User,
                   @Param('dietId', ParseIntPipe) dietId: number,
                   @Body() body: CreatePostDto): Promise<PostResDto> {
    return this.postService.createPost(user.id, dietId, body);
  }

  @Delete('/:postId')
  @ApiResponse({ status: 204, description: 'Successfully delete a post item.' })
  @ApiCommonErrorResponse()
  async deletePost(@Param('postId', ParseIntPipe) postId: number): Promise<string> {
    await this.postService.deletePost(postId);
    return 'Successfully delete a post item.';
  }

  /* call POST / -> retrieve postId from response ->
     call POST /:postId/upload-image -> post is uploaded */
  @Post('/:postId/upload')
  @Post('upload-images')
  @ApiCommonErrorResponse()
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
    description: 'Upload multiple images.',
    type: UploadImagesReqDto,
  })
  async uploadPostImages(@UploadedFiles() files: Express.Multer.File[], @Param('postId', ParseIntPipe) postId: number) {
    if (!files || files.length === 0) {
      console.log(files);
      throw new BadRequestException('No files uploaded');
    }
    const urls = await this.uploadService.uploadPostImages(files);
    console.log(urls);
    await this.postService.linkPicToPost(urls, postId);
    return urls;
  }

  @Delete('/deleteAll')
  @ApiCommonErrorResponse()
  async deleteAll(@CurrentUser() user: User) {
    return this.postService.deletePostByUserId(user.id);
  }

  @Patch('/:postId')
  @ApiCommonErrorResponse()
  async editPost(@Param('postId', ParseIntPipe) postId: number, @Body() body: EditPostDto) {
    return this.postService.editPost(postId, body);
  }

  @Get('/:postId')
  @Public()
  @ApiCommonErrorResponse()
  async getPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostByPostId(postId);
  }

}
