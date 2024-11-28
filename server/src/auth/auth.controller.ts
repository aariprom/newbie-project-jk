import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { Public } from './public.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Public()
  async signup(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.createUser(body);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    await this.authService.login(body, res);
    return 'Login successful.';
  }

  @Post('/logout')
  async logout(
    @CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user, res);
    return 'Logout successful.';
  }

  @Get('/authCheck')
  @Public()
  async authCheck(@CurrentUser() user: User) {
    return this.authService.authCheck(user);
  }
}
