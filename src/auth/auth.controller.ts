import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ILoginResponse } from 'src/types/auth';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() request): Promise<ILoginResponse> {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request) {
    return request.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refreshToken(@Request() request): Promise<ILoginResponse> {
    return this.authService.login(request.user);
  }
}
