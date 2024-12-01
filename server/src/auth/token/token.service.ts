import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from '../../prisma.service'

type TokenInfo = { token: string, userId: string };

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /*************** Token Validation  ***************/

  // Method to create access token
  createAccessToken(userId: string): string {
    const tokenPayload = { userId };
    const expiresInAccess = this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_MS');

    return this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${expiresInAccess}ms`,  // Expiry time for access token
    });
  }

  // Method to create refresh token
  createRefreshToken(userId: string): string {
    const tokenPayload = { userId };
    const expiresInRefresh = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_MS');

    return this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${expiresInRefresh}ms`,  // Expiry time for refresh token
    });
  }

  /*************** Token Setting to Response  ***************/

  // Method to send cookies with the access and refresh tokens
  setCookies(response: Response, accessToken: string, refreshToken: string): void {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(expiresAccessToken.getTime() + parseInt(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_MS')));

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(expiresRefreshToken.getTime() + parseInt(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_MS')));

    console.log(accessToken);
    console.log(refreshToken);

    response.cookie('Authentication', accessToken, {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });
  }

  /*************** Token Invalidation  ***************/

  async invalidateTokens(user: any, res: Response): Promise<void> {

    // expire access token
    res.cookie('Authentication', '', {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: new Date(0), // set expiration time to past -> immediately invalidate
    });

    // expire refresh token
    res.cookie('Refresh', '', {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: new Date(0),
    })

    // remove refresh token from DB
    console.log(user.id);
    await this.removeRefreshToken(user.id);
  }

  /*************** Refresh Token Management with DB ***************/

  // Store the refresh token (assuming you store them in a DB or a cache)
  async storeRefreshToken(refreshToken: string, user: any): Promise<TokenInfo> {
    return this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      }
    })
  }

  async getRefreshToken(userId: string): Promise<string> {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        userId: userId,
      },
      select: {
        token: true,
      }
    })
    if (!token) {
      return null;
    }
    return token.token;
  }

  async removeRefreshToken(userId: string): Promise<TokenInfo> {
    return this.prisma.refreshToken.delete({
      where: {
        userId: userId,
      }
    })
  }

}
