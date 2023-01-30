import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  login: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
