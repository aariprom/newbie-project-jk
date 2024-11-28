import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('[jwt.middleware] Request cookie: ', req.cookies);
      console.log('[jwt.middleware] JWT Authentication:', req.cookies?.Authentication);
      console.log('[jwt.middleware] JWT Refresh:', req.cookies?.Refresh);
    } catch (e) {
      console.log('[jwt.middleware] error occurred: ', e);
    } finally {
      next();
    }
  }
}
