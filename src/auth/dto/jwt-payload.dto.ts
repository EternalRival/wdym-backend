export class JwtPayloadDto {
  public sub: number;
  public image: string;
  public username: string;
  public iat?: number;
  public exp?: number;
}
