import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get()
  getAuth() {
    return this.service.getHello();
  }
  /*  @Get('lobby')
  getLobby() {
    return 'lobby';
  }
  @Get('game')
  getGame() {
    return 'game';
  } */
}
