import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { TokenService } from './token/token.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(params: any): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(params.pw, salt);
      const currentDateTime = (new Date()).toISOString();
      const data = await this.prisma.user.create({
        data: {
          ...params,
          pw: hashedPassword,
          createdDate: currentDateTime,
          modifiedDate: currentDateTime,
        },
      });
      return data;
    } catch (e) {
      console.log(e.code);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          console.log('There is a unique constraint violation, a new user cannot be created with this id or email');
        }
      }
      throw new HttpException('There is another account with same id or email.', HttpStatus.BAD_REQUEST);
    }
  }

  async login(user: User, res: Response, redirect = false) {
    // Generate tokens using TokenService
    const accessToken = this.tokenService.createAccessToken(user.id);
    const refreshToken = this.tokenService.createRefreshToken(user.id);
    console.log('[auth.service.ts] login() | accessToken: ', accessToken);
    console.log('[auth.service.ts] login() | refreshToken: ', refreshToken);

    /*// Store refresh token
    const token = await this.tokenService.getRefreshToken(user.id)
    if (!token) {
      await this.tokenService.storeRefreshToken(refreshToken, user);
    }*/

    // Set cookies
    this.tokenService.setCookies(res, accessToken, refreshToken);
    console.log('[auth.service.ts] login() | Cookie is set');

    // Redirect after login if needed
    /*if (redirect) {
      res.redirect(this.configService.get('AUTH_UI_REDIRECT'));
    }*/
  }

  async logout(user: any, res: Response, redirect = false): Promise<void> {
    console.log('[auth.service.ts] logout() | user: ', user);

    // remove refreshToken from db
    await this.tokenService.invalidateTokens(user, res);
    console.log('[auth.service.ts] logout() | Successfully invalidated tokens.');
    /*if (redirect) {
      res.redirect(this.configService.get('AUTH_UI_REDIRECT'));
    }*/
  }

  async verifyUser(id: string, password: string) {
    try {
      const user = await this.usersService.getUser(id);
      const authenticated = await compare(password, user.pw);
      console.log('[auth.service.ts] verifyUser() | user: ', user);
      console.log('[auth.service.ts] verifyUser() | authenticated:, ', authenticated);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async authCheck(user: User) {
    return !!(user && user.id);
  }

  async verifyUserRefreshToken(refreshToken: string, id: string) {
    try {
      /*console.log('[auth.service] verifyUserRefreshToken() | userId: ', id);
      console.log('[auth.service] verifyUserRefreshToken() | refreshToken:, ', refreshToken);*/
      const user = await this.usersService.getUser(id);
      const storedRefreshToken = await this.tokenService.getRefreshToken(id);
      const authenticated = await compare(refreshToken, storedRefreshToken.token);
      /*console.log('[auth.service.ts] verifyUserRefreshToken() | authenticated:', authenticated);*/
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }
}