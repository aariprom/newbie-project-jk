import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { PublicGuard } from './guards/public.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { createUserDto } from './dto/createUserDto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Public()
  async createUser(@Body() body: createUserDto): Promise<User> {
    return this.authService.createUser(body);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(user, res);
    return res.json({ message: 'Login successful.' });
  }

  @Post('/logout')
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user, res);
    return res.json({ message: 'Logout successful.' });
  }

  @Get('/authCheck')
  @Public()
  async authCheck(@CurrentUser() user: User) {
    return this.authService.authCheck(user);
  };

  @Post('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }
}