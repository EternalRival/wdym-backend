import { User } from '../../entities/user.entity';

export class IJwtAuthGuardRequestDto {
  public user!: { id: User['id'] };
}
