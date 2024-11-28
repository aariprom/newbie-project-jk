import { Module } from '@nestjs/common';
import { TokenInterceptor } from '../../token.interceptor';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { S3Service } from '../../S3/s3.service';

@Module({
  providers: [TokenService, JwtService, TokenInterceptor, PrismaService, AuthService, UsersService, S3Service,],
  exports: [TokenService, JwtService],  // Export services that other modules might use
})
export class TokenModule {}
