import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ILoginResponse } from '../types/auth';
import { LoginUserDto } from '../users/user/login-user.dto';
import { User } from '../users/user/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  public async validateUser(login: LoginUserDto): Promise<User> {
    const user = await this.usersService.findUserByUsername(login.username);
    if (user && (await compare(login.password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  public async login(login: LoginUserDto): Promise<ILoginResponse> {
    const { id, image, username } = await this.usersService.findUserByUsername(login.username);
    const payload = { sub: id, image, username };
    return { access_token: this.jwtService.sign(payload) };
  }
}
