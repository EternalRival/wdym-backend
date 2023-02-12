import { Body, Controller, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { ResponseBooleanDto } from '../shared/dto/response-boolean.dto';
import { PasswordUserDto } from '../users/dto/password.dto';
import { SignInUserDto } from '../users/dto/sign-in-user.dto';
import { AuthService } from './auth.service';
import { IJwtAuthGuardRequest } from './interfaces/jwt-auth.guard.interface';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { ILocalAuthGuardRequest } from './interfaces/local-auth.guard.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignInUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Req() request: ILocalAuthGuardRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JwtTokenDto> {
    const token = await this.authService.login(request.user);
    this.authService.setCookies(response, token, 0.05);
    return token;
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public async refreshToken(
    @Req() request: IJwtAuthGuardRequest,
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
  @Post('validate')
  public async validatePassword(
    @Req() request: IJwtAuthGuardRequest,
    @Body() body: PasswordUserDto,
  ): Promise<ResponseBooleanDto> {
    const isValid = await this.authService.validatePassword(request.user.id, body.password);
    Logger.log(JSON.stringify(isValid), LoggerTag.VALIDATE);
    return isValid;
  }
}
