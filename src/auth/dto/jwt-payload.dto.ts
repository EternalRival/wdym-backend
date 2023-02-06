export class JwtPayloadDto {
  public sub: number;
  public image: number;
  public username: string;
  public iat?: number;
  public exp?: number;
}
