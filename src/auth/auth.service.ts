import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { SignInUserDto } from '../users/dto/sign-in-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { teapot } from '../utils/custom-error';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  public async validateUser(signInData: SignInUserDto): Promise<User> {
    const user: User = await this.usersService.findUserByUsername(signInData.username);
    const validateResult: boolean = await compare(signInData.password, user.password);
    if (user instanceof User && validateResult) {
      return user;
    }
    throw teapot('validation fail');
  }

  public generateJwtPayload(data: { id: number; image: string; username: string }): IJwtPayload {
    return { sub: data.id, image: data.image, username: data.username };
  }

  public async generateToken(id: User['id']): Promise<JwtTokenDto> {
    const entity: User = await this.usersService.findOneById(id);
    const payload: IJwtPayload = this.generateJwtPayload(entity);
    return { access_token: this.jwtService.sign(payload) };
  }

  public login(login: User): Promise<JwtTokenDto> {
    return this.generateToken(login.id);
  }
  public refreshToken(id: User['id']): Promise<JwtTokenDto> {
    return this.generateToken(id);
  }

  public setCookies(response: Response, token: JwtTokenDto, hours: number): void {
    const key = 'access_token';
    response.cookie(key, token[key], { maxAge: 3600000 * hours, httpOnly: true });
  }

  //? TL Request
  public async validatePassword(id: number, password: string): Promise<boolean> {
    const user: User = await this.usersService.findOneById(id);
    return user && (await compare(password, user.password));
  }
}
