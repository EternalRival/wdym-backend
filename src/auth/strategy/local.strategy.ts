import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../users/entity/users.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  private async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
