import { Module } from '@nestjs/common';
import { UsersAuthModule } from './auth/auth.module';
import { UsersApiModule } from './api/api.module';

@Module({
  imports: [UsersApiModule, UsersAuthModule],
})
export class UsersModule {}
