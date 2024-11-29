import { Module } from '@nestjs/common';
import { TokenInterceptor } from '../../token.interceptor';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/user.service';
import { UploadModule } from '../../upload/upload.module';

@Module({
  imports: [UploadModule],
  providers: [TokenService, JwtService, TokenInterceptor, AuthService, UserService,],
  exports: [TokenService, JwtService],  // Export services that other modules might use
})
export class TokenModule {}
