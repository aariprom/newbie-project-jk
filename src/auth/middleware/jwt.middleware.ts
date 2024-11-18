import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogJwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('[logJwt.middleware.ts] Request cookie: ', req.cookies);
    console.log('[logJwt.middleware.ts] JWT Token:', req.cookies?.Authentication);
    next();
  }
}
