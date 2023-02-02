import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  password: string;
}
