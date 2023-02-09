import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoggerTag } from '../../logger/enums/logger-tag.enum';
import { SignInUserDto } from '../../users/dto/sign-in-user.dto';
import { AuthService } from '../auth.service';
import { ILocalAuthGuardRequest } from '../interfaces/local-auth.guard.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private logger = new Logger(LoggerTag.GUARD);

  constructor(private authService: AuthService) {
    super();
  }

  private async validate(
    username: SignInUserDto['username'],
    password: SignInUserDto['password'],
  ): Promise<ILocalAuthGuardRequest['user']> {
    const signInData = { username, password };
    this.logger.log('local validate used');

    const user = await this.authService.validateUser(signInData);
    if (user) {
      return user;
    }
    throw new HttpException('Wrong Authorization Data', HttpStatus.FORBIDDEN);
  }
}
