import { LoginUserDto } from '../users/user/login-user.dto';
import { User } from '../users/user/user.entity';

export interface IJwtToken {
  access_token: string;
}

export interface ILocalGuardRequest {
  user: User;
}
export interface IJwtGuardRequest {
  user: { id: User['id'] };
}

export interface IJwtPayload {
  sub: number;
  image: string;
  username: string;
  iat?: number;
  exp?: number;
}
