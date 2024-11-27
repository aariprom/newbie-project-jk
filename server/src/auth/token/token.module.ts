import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TokenService, PrismaService, JwtService],
  exports: [
    TokenService
  ],
})
export class TokenModule {}
