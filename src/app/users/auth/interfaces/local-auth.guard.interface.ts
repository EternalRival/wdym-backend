import { User } from '../../entities/user.entity';

export interface ILocalAuthGuardRequest {
  user: User;
}
