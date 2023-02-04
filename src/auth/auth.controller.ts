import { Controller, Post, Request as Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ILoginRequest } from '../types/auth';
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
  public async login(@Req() { user }: ILoginRequest, @Res({ passthrough: true }) response: Response): Promise<void> {
    const token = await this.authService.login(user);
    this.authService.setCookies(response, token, 0.05);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public async refreshToken(
    @Req() { user }: ILoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const token = await this.authService.refreshToken(user);
    this.authService.setCookies(response, token, 1);
  }

  //? YAGNI
  /*
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Req() request: Request): Request['user'] {
    return request.user;
  } */
}
