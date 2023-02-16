import { ApiProperty } from '@nestjs/swagger';

export interface IJwtPayload {
  sub: number;
  image: string;
  username: string;
  iat?: number;
  exp?: number;
}
