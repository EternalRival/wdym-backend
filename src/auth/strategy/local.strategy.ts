import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../users/user/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  private async validate(username: string, password: string): Promise<User> {
    console.log('local validate used');
    const user = await this.authService.validateUser({ username, password });
    if (user) {
      return user;
    }
    throw new HttpException('Wrong Authorization Data', HttpStatus.FORBIDDEN);
  }
}
