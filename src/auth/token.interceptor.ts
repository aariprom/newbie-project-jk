import { Injectable } from '@nestjs/common';
import { ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TokenService } from './token/token.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  // Intercept method for handling expired tokens
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['authorization']?.split(' ')[1];  // Extract the access token

    if (!accessToken) {
      return next.handle();
    }

    try {
      // Try to verify the access token
      const decodedAccessToken = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      });

      // If the access token is valid, continue with the request
      return next.handle();
    } catch (err) {
      // If the access token is expired or invalid, try to refresh using the refresh token
      const refreshToken = request.cookies['refreshToken'];  // Assuming refresh token is stored in cookies
      const userId = request.user?.userId;  // Assuming userId is available (from the access token or JWT payload)

      if (!refreshToken || !userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      try {
        // Validate the refresh token and user ID to ensure both are correct
        const isValid = await this.authService.verifyUserRefreshToken(refreshToken, userId);

        if (isValid) {
          // Generate a new access token
          const newAccessToken = this.tokenService.createAccessToken(userId);

          // Attach the new access token to the request headers
          request.headers['authorization'] = `Bearer ${newAccessToken}`;
          return next.handle();  // Retry the original request with the new access token
        }
      } catch (refreshError) {
        // If the refresh token is invalid, respond with Unauthorized
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
