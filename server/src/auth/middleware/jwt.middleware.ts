import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private tokenService: TokenService,
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.Authentication;
    const refreshToken = req.cookies?.Refresh;
    try {
      console.log('[jwt.middleware] JWT Authentication:', accessToken);
      console.log('[jwt.middleware] JWT Refresh:', refreshToken);

      const decoded = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      req.user = { id: decoded.userId };
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
        res.cookie('Authentication', newAccessToken, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          sameSite: 'strict',
        });

        console.log('asdf');

        // Attach user info to the req for further processing
        req.user = { id: userId };
      } catch (refreshError) {
        console.log('Error while refreshing token.', refreshError);
        throw new HttpException('Unauthorized, Please remove cookies and login again.', HttpStatus.UNAUTHORIZED);
      }
    } finally {
      next();
    }
  }
}
