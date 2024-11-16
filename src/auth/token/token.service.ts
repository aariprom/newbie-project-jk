import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RefreshToken, Prisma } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {};

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
    console.log('[token.service.ts] createRefreshToken():');
    console.log('token: ', data.token, 'userId: ', data.user.create.id);
    return this.prisma.refreshToken.create({ data:
        {
          token: data.token,
          userId: data.user.create.id
        }});
  }

  async getRefreshToken(userId: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.findUnique({
      where: {
        userId: userId,
      }
    })
  }

  async removeRefreshToken(userId: string): Promise<void> {
    this.prisma.refreshToken.delete({
      where: {
        userId: userId,
      }
    })
  }
}
