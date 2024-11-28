import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // this is fucking retarded
    super({
      usernameField: 'id',
      passwordField: 'pw',
    });
  }

  async validate(email: string, password: string) {
    return this.authService.verifyUser(email, password);
  }
}