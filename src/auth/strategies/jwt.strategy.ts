import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { JwtAuthGuardRequestDto } from '../dto/jwt-auth.guard.dto';
import { JwtTokenDto } from '../dto/jwt-token.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  private validate(payload: JwtPayloadDto): JwtAuthGuardRequestDto['user'] {
    Logger.log(`jwt validate used: ${JSON.stringify(payload)}`, 'Guard');
    return { id: payload.sub };
  }

  private static extractJWT(request: Request): JwtTokenDto['access_token'] | null {
    if (request.cookies && 'access_token' in request.cookies) {
      return request.cookies.access_token;
    }
    return null;
  }
}
