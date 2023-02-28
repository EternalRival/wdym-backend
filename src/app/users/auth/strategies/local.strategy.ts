import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoggerTag } from '../../../shared/enums/logger-tag.enum';
import { SignInUserDto } from '../../dto/sign-in-user.dto';
import { User } from '../../entities/user.entity';
import { UsersAuthService } from '../auth.service';
import { ILocalAuthGuardRequestDto } from '../dto/local-auth.guard.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  public logger = new Logger(LoggerTag.GUARD);

  constructor(private authService: UsersAuthService) {
    super();
  }

  private async validate(
    username: SignInUserDto['username'],
    password: SignInUserDto['password'],
  ): Promise<ILocalAuthGuardRequestDto['user']> {
    const signInData = { username, password };
    this.logger.log('local validate used');

    const user: User = await this.authService.validateUser(signInData);
    if (!(user instanceof User)) {
      throw new HttpException('Wrong Authorization Data', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
