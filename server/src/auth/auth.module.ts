import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TokenModule } from './token/token.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { TokenService } from './token/token.service';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, TokenModule],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    PrismaService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}