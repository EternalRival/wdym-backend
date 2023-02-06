import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseBooleanDto } from '../types/response-boolean.dto';
import { PasswordUserDto } from '../users/dto/password.dto';
import { SignInUserDto } from '../users/dto/sign-in-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuardRequestDto } from './dto/jwt-auth.guard.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { LocalAuthGuardRequestDto } from './dto/local-auth.guard.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignInUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Req() request: LocalAuthGuardRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JwtTokenDto> {
    console.log('login', request.user);
    const token = await this.authService.login(request.user);
    this.authService.setCookies(response, token, 0.05);
    return token;
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public async refreshToken(
    @Req() request: JwtAuthGuardRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JwtTokenDto> {
    console.log('refresh', request.user);
    const token = await this.authService.refreshToken(request.user.id);
    this.authService.setCookies(response, token, 1);
    return token;
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  public validatePassword(
    @Req() request: JwtAuthGuardRequestDto,
    @Body() body: PasswordUserDto,
  ): Promise<ResponseBooleanDto> {
    return this.authService.validatePassword(request.user.id, body.password);
  }
}
