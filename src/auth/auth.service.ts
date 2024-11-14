import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { TokenPayload } from './token-payload.interface';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async login(user: User, response: Response, redirect = false) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
      parseInt(
        this.configService.getOrThrow<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_MS',
        ),
      ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
      parseInt(
        this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_MS',
        ),
      ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    await this.tokenService.createRefreshToken(
      { token: refreshToken,
        user: {
          create: user
        }
      }
    )

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });

    if (redirect) {
      response.redirect(this.configService.getOrThrow('AUTH_UI_REDIRECT'));
    }
  }

  async verifyUser(id: string, password: string) {
    try {
      const user = await this.usersService.getUser(id);
      const authenticated = await compare(password, user.pw);
      console.log('[auth.service.ts] verifyUser(): user: ', user);
      console.log('[auth.service.ts] verifyUser(): authenticated?:, ', authenticated);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async verifyUserRefreshToken(refreshToken: string, id: string) {
    try {
      const user = await this.usersService.getUser(id);
      const storedRefreshToken = await this.tokenService.getRefreshToken(id);
      const authenticated = await compare(refreshToken, storedRefreshToken.token);
      /*if (!authenticated) {
        throw new UnauthorizedException();
      }*/
      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }
}