import { PickType } from '@nestjs/swagger';
import { SignUpUserDto } from './sign-up-user.dto';

export class SignInUserDto extends PickType(SignUpUserDto, ['username', 'password']) {}
