import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(60)
  password: string;
}
