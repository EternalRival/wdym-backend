import { User } from '../../entities/user.entity';

export interface IJwtAuthGuardRequest {
  user: { id: User['id'] };
}
