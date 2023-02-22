import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { IJwtPayloadDto } from '../dto/jwt-payload.dto';
import { IJwtAuthGuardRequestDto } from '../dto/jwt-auth.guard.dto';
import { JwtTokenDto } from '../dto/jwt-token.dto';
import { LoggerTag } from '../../../shared/enums/logger-tag.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public logger = new Logger(LoggerTag.GUARD);

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  private validate(payload: IJwtPayloadDto): IJwtAuthGuardRequestDto['user'] {
    this.logger.log(`jwt validate used: ${JSON.stringify(payload)}`);
    return { id: payload.sub };
  }

  private static extractJWT(request: Request): JwtTokenDto['access_token'] | null {
    if (request.cookies && 'access_token' in request.cookies) {
      return request.cookies.access_token;
    }
    return null;
  }
}
