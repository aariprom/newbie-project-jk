import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { Public } from './public.decorator';
import { CredentialDto } from './dto/credential.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UserResDto } from '../user/dto/userRes.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Public()
  @ApiResponse({ status: 201, description: 'User created successfully.', type: UserResDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async signup(@Body() body: CreateUserDto): Promise<UserResDto> {
    return this.authService.createUser(body);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 201, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Login failed.' })
  async login(@Body() body: CredentialDto, @Res({ passthrough: true }) res: Response): Promise<string> {
    await this.authService.login(body, res);
    return 'Login successful.';
  }

  @Post('/logout')
  @ApiResponse({ status: 201, description: 'Logout successful.' })
  async logout(
    @CurrentUser() user: User, @Res({ passthrough: true }) res: Response): Promise<string> {
    await this.authService.logout(user, res);
    return 'Logout successful.';
  }

  @Get('/check')
  @Public()
  @ApiResponse({
    status: 200, description: 'Authentication check successful.',
    type: CredentialDto
  })
  async check(@CurrentUser() user: User): Promise<Partial<CredentialDto>> {
    return this.authService.authCheck(user);
  }

  @Post('/refresh')
  @ApiResponse({ status: 201, description: 'Refresh token successful.' })
  async refresh(@CurrentUser() user: User): Promise<string> {
    return 'Refresh successful.';
  }
}
