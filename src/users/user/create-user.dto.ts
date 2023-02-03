import { MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(4)
  @MaxLength(24)
  public username: string;

  @MinLength(8)
  @MaxLength(20)
  public password: string;

  public image: string;
}
