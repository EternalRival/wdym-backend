import { Module } from '@nestjs/common';
import { IoHooksGateway } from './hooks/hooks.gateway';
import { IoGateway } from './io.gateway';
import { IoRoomsModule } from './rooms/rooms.module';

@Module({
  imports: [IoRoomsModule],
  providers: [IoGateway, IoHooksGateway],
})
export class IoModule {}
