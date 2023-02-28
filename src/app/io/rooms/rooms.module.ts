import { Module } from '@nestjs/common';
import { IoRoomsService } from './rooms.service';

@Module({
  providers: [IoRoomsService],
  exports: [IoRoomsService],
})
export class IoRoomsModule {}
