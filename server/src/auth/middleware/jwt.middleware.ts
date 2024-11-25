import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService,
              private readonly configService: ConfigService,) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log('[jwt.middleware.ts] Request cookie: ', req.cookies);
    console.log('[jwt.middleware.ts] JWT Token:', req.cookies?.Authentication);

    /* todo: is this safe? */
    /* this is to extract userId from token, and to access it from controller and service globally */
    if (req.cookies?.Authentication != undefined) {
      req['payload'] = this.jwtService.verifyAsync(req.cookies?.Authentication,
        {
          secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        },
      );
    }
    next();
  }
}

