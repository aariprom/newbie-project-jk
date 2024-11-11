import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(id: string, pass: string): Promise<any> {
    const user = await this.usersService.getUser(id);
    const validPassword = await bcrypt.compare(pass, user.pw);
    if (!validPassword) {
      throw new UnauthorizedException('invalid id or password');
    }
    else {
      const { pw, ...result } = user;
      return result;
    }
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}