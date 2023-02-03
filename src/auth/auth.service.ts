import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { AccessToken } from '../types/auth';
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

  public async generateToken(username: User['username']): Promise<AccessToken> {
    const entity = await this.usersService.findUserByUsername(username);
    const payload = { sub: entity.id, image: entity.image, username: entity.username };
    return this.jwtService.sign(payload);
  }

  public login(login: LoginUserDto): Promise<AccessToken> {
    const token = this.generateToken(login.username);
    return token;
  }
  public refreshToken(login: LoginUserDto): Promise<AccessToken> {
    const token = this.generateToken(login.username);
    return token;
  }

  public setCookies(response: Response, token: AccessToken, hours: number): void {
    response.cookie('access_token', token, { maxAge: 3600000 * hours, httpOnly: true });
  }
}
