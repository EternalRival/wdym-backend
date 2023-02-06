import { PartialType } from '@nestjs/swagger';
import { SignUpUserDto } from './sign-up-user.dto';

export class UpdateUserDto extends PartialType(SignUpUserDto) {}
