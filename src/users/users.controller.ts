import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  async createUser(
    // createdDate, modifiedDate -> frontend
    @Body() userData: { id: string, pw: string, name: string, email: string }
  ): Promise<User> {
    const currentDateTime = (new Date()).toISOString();
    return this.userService.createUser({ ...userData, createdDate: currentDateTime, modifiedDate: currentDateTime });
  }
}