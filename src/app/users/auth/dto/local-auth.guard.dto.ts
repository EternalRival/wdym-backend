import { User } from '../../entities/user.entity';

export class ILocalAuthGuardRequestDto {
  public user!: User;
}
