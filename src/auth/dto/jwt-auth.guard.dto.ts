import { User } from '../../users/entities/user.entity';

export class JwtAuthGuardRequestDto {
  public user: { id: User['id'] };
}
