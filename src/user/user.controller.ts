import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    // createdDate, modifiedDate -> frontend
    @Body() userData: { id: string, pw: string, name: string, email: string, createdDate: string, modifiedDate: string}
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.getUser(id);
  }

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.userService.getUsers({});
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: { name?: string; email?: string }
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: String(id) },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: String(id) });
  }
}