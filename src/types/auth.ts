import { LoginUserDto } from '../users/user/login-user.dto';

export interface ILoginResponse {
  access_token: AccessToken | Promise<AccessToken>;
}

export interface ILoginRequest {
  user: LoginUserDto;
}

export type AccessToken = string;
