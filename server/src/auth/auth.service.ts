import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { TokenService } from './token/token.service';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialDto } from './dto/credential.dto';
import { UserResDto } from '../user/dto/userRes.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(params: any): Promise<UserResDto> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.pw, salt);
    const currentDateTime = (new Date()).toISOString();
    const user = await this.prisma.user.create({
      data: {
        ...params,
        pw: hashedPassword,
        createdDate: currentDateTime,
        modifiedDate: currentDateTime,
      },
    });
    return new UserResDto(user, true, true);
  }

  async login(user: CredentialDto, res: Response, redirect = false): Promise<void> {
    // Generate tokens using TokenService
    const accessToken = this.tokenService.createAccessToken(user.id);

    // Store refresh token only if there is no refresh token in db
    let refreshToken = await this.tokenService.getRefreshToken(user.id)
    if (!refreshToken) {
      refreshToken = this.tokenService.createRefreshToken(user.id);
      await this.tokenService.storeRefreshToken(refreshToken, user);
    }

    // Set cookies
    this.tokenService.setCookies(res, accessToken, refreshToken);

    // Redirect after login if needed
    /*if (redirect) {
      res.redirect(this.configService.get('AUTH_UI_REDIRECT'));
    }*/
  }

  async logout(user: any, res: Response, redirect = false): Promise<void> {
    // remove refreshToken from db
    await this.tokenService.invalidateTokens(user, res);
    console.log('[auth.service.ts] logout() | Successfully invalidated tokens.');
    /*if (redirect) {
      res.redirect(this.configService.get('AUTH_UI_REDIRECT'));
    }*/
  }

  async verifyUser(id: string, password: string): Promise<CredentialDto> {
    try {
      const user = await this.userService.getPassword(id);
      const authenticated = await compare(password, user.pw);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async authCheck(user: User): Promise<Partial<CredentialDto>> {
    console.log('authCheck');
    if (!user || !user.id) {
      return new CredentialDto({ id: null });
    }
    return new CredentialDto({ id: user.id });
  }

  async verifyUserRefreshToken(refreshToken: string, id: string): Promise<UserResDto> {
    try {
      const user = await this.userService.getUserProfile(id, id);
      const storedRefreshToken = await this.tokenService.getRefreshToken(id);
      const authenticated = storedRefreshToken === refreshToken;
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.', err);
    }
  }
}
