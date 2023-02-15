import { MaxLength, MinLength } from 'class-validator';

export class SignUpUserDto {
  @MinLength(4)
  @MaxLength(24)
  public username!: string;

  @MinLength(8)
  @MaxLength(20)
  public password!: string;

  public image!: string;
}
