import { LoginUserDto } from '../users/user/login-user.dto';

export interface ILoginResponse {
  access_token: string;
}

export interface ILoginRequest {
  user: LoginUserDto;
}
