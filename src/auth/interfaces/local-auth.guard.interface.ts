import { User } from '../../users/entities/user.entity';

export interface ILocalAuthGuardRequest {
  user: User;
}
