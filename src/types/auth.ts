import { User } from '../users/user/user.entity';

export interface ILoginResponse {
  access_token: string;
}

export interface ILoginRequest {
  user: User;
}
