import { User } from '../../users/entities/user.entity';

export class LocalAuthGuardRequestDto {
  public user: User;
}
