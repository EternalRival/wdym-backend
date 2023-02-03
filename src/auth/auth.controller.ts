import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ILoginResponse } from '../types/auth';
import { User } from '../users/user/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  private login(@Request() request: { user: User }): Promise<ILoginResponse> {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  private getProfile(@Request() request: { user: unknown }): unknown {
    return request.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  private refreshToken(@Request() request: { user: User }): Promise<ILoginResponse> {
    return this.authService.login(request.user);
  }
}
