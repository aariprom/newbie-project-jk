import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { EditUserProfileDto } from './dto/editUserProfile.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadImageReqDto } from './dto/uploadImageReq.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService,
              private readonly uploadService: UploadService,
              ) {}

  @Get('/profile')
  async profile(@CurrentUser() user: User) {
      return this.userService.getUserProfile(user.id, user.id);
  }

  @Patch('/profile/edit')
  async editProfile(@CurrentUser() user: User, @Body() body: EditUserProfileDto) {
    return this.userService.editProfile(user.id, body);
  }

  @Post('/profile/upload-profile-pic')
  @UseInterceptors(FileInterceptor('file', {
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
    description: 'Upload profile image.',
    type: UploadImageReqDto, // Define a DTO for Swagger documentation
  })
  async uploadProfileImage(@UploadedFiles() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No files uploaded');
    }
    return await this.uploadService.uploadUserProfileImage(file);
  }

  @Delete('/delete-account')
  async deleteAccount(@CurrentUser() user: User) {
    return this.userService.deleteUser(user.id);
  }

  @Get('/:userId/profile')
  async getProfile(@CurrentUser() user: User, @Param('userId') userId: string) {
    return this.userService.getUserProfile(user.id, userId);
  }

  /*@Get('/:userId/post')
  async getPostByUserId(@Param('userId') userId: string) {
    return this.postService.getPostByUserId(userId);
  }*/
}