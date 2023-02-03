import { LoginUserDto } from '../users/user/login-user.dto';

export interface ILoginRequest {
  user: LoginUserDto;
}

export type AccessToken = string;
