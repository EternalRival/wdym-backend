import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ILoginResponse } from 'src/types/auth';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByUsername(username);

    if (user && (await compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User): Promise<ILoginResponse> {
    const { id, image, username } = await this.usersService.findUserByUsername(user.username);
    const payload = { username, sub: id };
    return { access_token: this.jwtService.sign(payload), image };
  }
}
