import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ILoginRequest, ILoginResponse } from '../types/auth';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*  @ApiBody({schema:{}}) */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(@Request() { user }: ILoginRequest): Promise<ILoginResponse> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public refreshToken(@Request() { user }: ILoginRequest): Promise<ILoginResponse> {
    return this.authService.login(user);
  }

  //? YAGNI
  /*
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Request() request: Request): Request['user'] {
    return request.user;
  } */
}
