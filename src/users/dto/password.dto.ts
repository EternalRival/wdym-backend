import { PickType } from '@nestjs/swagger';
import { SignInUserDto } from './sign-in-user.dto';

export class PasswordUserDto extends PickType(SignInUserDto, ['password']) {}
