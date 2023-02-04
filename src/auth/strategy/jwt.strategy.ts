import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  private validate(payload: { sub: unknown; username: unknown }): unknown {
    console.log('jwt validate used');
    return { userId: payload.sub, username: payload.username };
  }

  private static extractJWT(request: Request): string | null {
    if (request.cookies && 'access_token' in request.cookies) {
      return request.cookies.access_token;
    }
    return null;
  }
}
