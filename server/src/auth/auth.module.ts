import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TokenModule } from './token/token.module';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token/token.service';

@Module({
  imports: [UserModule, PassportModule, JwtModule, TokenModule],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}