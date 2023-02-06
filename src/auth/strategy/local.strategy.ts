import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SignInUserDto } from '../../users/dto/sign-in-user.dto';
import { AuthService } from '../auth.service';
import { LocalAuthGuardRequestDto } from '../dto/local-auth.guard.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  private async validate(
    username: SignInUserDto['username'],
    password: SignInUserDto['password'],
  ): Promise<LocalAuthGuardRequestDto['user']> {
    const signInData = { username, password };
    console.log('local validate used', signInData);

    const user = await this.authService.validateUser(signInData);
    if (user) {
      return user;
    }
    throw new HttpException('Wrong Authorization Data', HttpStatus.FORBIDDEN);
  }
}
