import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction, } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService,
              private readonly configService: ConfigService,
              private readonly tokenService: TokenService,) {}

  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}

