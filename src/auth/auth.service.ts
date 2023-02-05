import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { IJwtToken, IJwtPayload } from '../types/auth';
import { LoginUserDto } from '../users/user/login-user.dto';
import { User } from '../users/user/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  public async validateUser(login: LoginUserDto): Promise<User> {
    const user = await this.usersService.findUserByUsername(login.username);
    if (user && (await compare(login.password, user.password))) {
      return user;
    }
    return null;
  }

  public generateJwtPayload(data: { id: number; image: string; username: string }): IJwtPayload {
    return { sub: data.id, image: data.image, username: data.username };
  }

  public async generateToken(id: User['id']): Promise<IJwtToken> {
    const entity: User = await this.usersService.findUserById(id);
    const payload: IJwtPayload = this.generateJwtPayload(entity);
    return { access_token: this.jwtService.sign(payload) };
  }

  public login(login: User): Promise<IJwtToken> {
    return this.generateToken(login.id);
  }
  public refreshToken(id: User['id']): Promise<IJwtToken> {
    return this.generateToken(id);
  }

  public setCookies(response: Response, token: IJwtToken, hours: number): void {
    const key = 'access_token';
    response.cookie(key, token[key], { maxAge: 3600000 * hours, httpOnly: true });
  }
}
