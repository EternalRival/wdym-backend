import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class IJwtPayloadDto {
  public sub!: number;
  public image!: string;
  public username!: string;
  @IsOptional()
  public iat?: number;
  @IsOptional()
  public exp?: number;
}
