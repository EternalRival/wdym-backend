import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { IJwtToken } from 'src/types/auth';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() request): IJwtToken {
    return this.authService.login(request.user);
  }
}
