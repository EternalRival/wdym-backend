import { Controller, Post, Request as Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IJwtGuardRequest, IJwtToken, ILocalGuardRequest } from '../types/auth';
import { LoginUserDto } from '../users/user/login-user.dto';
import { User } from '../users/user/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Req() request: ILocalGuardRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IJwtToken> {
    console.log('login', request.user);
    const token = await this.authService.login(request.user);
    this.authService.setCookies(response, token, 0.05);
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public async refreshToken(
    @Req() request: IJwtGuardRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IJwtToken> {
    console.log('refresh', request.user);
    const token = await this.authService.refreshToken(request.user.id);
    this.authService.setCookies(response, token, 1);
    return token;
  }

  //? YAGNI
  /*
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Req() request: Request): Request['user'] {
    return request.user;
  }
  */
}
