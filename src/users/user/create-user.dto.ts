import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  public username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  public password: string;

  public image: string;
}
