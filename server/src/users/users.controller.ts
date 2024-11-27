import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: any): Promise<User> {
    console.log('[user.controller.ts] createUser() | body: ', body);
    return this.userService.createUser(body);
  }
}