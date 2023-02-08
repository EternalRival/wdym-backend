import { PickType } from '@nestjs/swagger';
import { SignUpUserDto } from '../../users/dto/sign-up-user.dto';

export class ChatMessage extends PickType(SignUpUserDto, ['username']) {
  public message: string;
  public timestamp?: number
}
