import { User } from '../../users/entities/user.entity';

export interface IJwtAuthGuardRequest {
  user: { id: User['id'] };
}
