import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { HooksGateway } from './hooks.gateway';
import { IoGateway } from './io.gateway';

@Module({
  providers: [IoGateway, HooksGateway],
})
export class IoModule {}
