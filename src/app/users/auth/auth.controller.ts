import { Body, Controller, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoggerTag } from '../../shared/enums/logger-tag.enum';
import { PasswordUserDto } from '../dto/password.dto';
import { SignInUserDto } from '../dto/sign-in-user.dto';
import { UsersAuthService } from './auth.service';
import { IJwtAuthGuardRequestDto } from './dto/jwt-auth.guard.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { ILocalAuthGuardRequestDto } from './dto/local-auth.guard.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class UsersAuthController {
  constructor(private authService: UsersAuthService) {}

  @ApiBody({ type: SignInUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Req() request: ILocalAuthGuardRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JwtTokenDto> {
    const token = await this.authService.login(request.user);
    this.authService.setCookies(response, token, 24);
    return token;
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public async refreshToken(
    @Req() request: IJwtAuthGuardRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JwtTokenDto> {
    console.log('refresh', request.user);
    const token = await this.authService.refreshToken(request.user.id);
    this.authService.setCookies(response, token, 24);
    return token;
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Post('validate')
  public async validatePassword(
    @Req() request: IJwtAuthGuardRequestDto,
    @Body() body: PasswordUserDto,
  ): Promise<boolean> {
    const isValid = await this.authService.validatePassword(request.user.id, body.password);
    Logger.log(JSON.stringify(isValid), LoggerTag.VALIDATE);
    return isValid;
  }
}
