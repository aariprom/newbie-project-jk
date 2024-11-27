import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload/upload.service';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService,
              private readonly uploadService: UploadService,) {}

  @Get('/profile')
  async profile(@CurrentUser() user: User) {
      return this.userService.getUser(user.id);
  }

  @Get('/profile/edit')
  async editProfile(@Req() req: any, @Body() body: any) {
    const payload = await req.payload;
    if (!payload) {
      throw new HttpException('Please login first if you didn\'t login.', HttpStatus.BAD_REQUEST);
    }
    const userId = payload.userId;
    return this.userService.editProfile(userId, body);
  }

  @Post('profile/upload-image')
  @UseInterceptors(FileInterceptor('file')) // Handle single file upload
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    // Validate file size/type as needed (optional)
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Call the service to upload to S3
    const fileUrl = await this.uploadService.uploadUserProfileImage(file);

    // Return the file URL
    return { fileUrl };
  }
}