import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { TokenService } from './auth/token/token.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    console.log('interceptor')
    const accessToken = request.cookies?.Authentication;
    const refreshToken = request.cookies?.Refresh;

    // No access token; move to the next handler
    if (!accessToken) {
      return next.handle();
    }

    try {
      // Validate the access token
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      });

      // Attach the decoded user ID (if needed)
      request.user = { id: decoded.userId };
      return next.handle();
    } catch (error) {
      if (error.name !== 'TokenExpiredError') {
        console.log('Invalid token.');
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      // Handle token expiration with refresh token
      if (!refreshToken) {
        console.log('Invalid refresh token.');
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      try {
        // Verify and validate the refresh token
        const decodedRefreshToken = this.jwtService.verify(refreshToken, {
          secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        });

        console.log('asdf');

        const userId = decodedRefreshToken.userId;
        const isValid = await this.authService.verifyUserRefreshToken(refreshToken, userId);

        console.log('asdf');

        if (!isValid) {
          console.log('Invalid refresh token.');
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        // Generate a new access token
        const newAccessToken = this.tokenService.createAccessToken(userId);

        // Set the new access token in cookies
        response.cookie('Authentication', newAccessToken, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          sameSite: 'strict',
        });

        console.log('asdf');

        // Attach user info to the request for further processing
        request.user = { id: userId };
        return next.handle();
      } catch (refreshError) {
        console.log('Error while refreshing token.')
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
