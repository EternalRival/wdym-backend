import { Module } from '@nestjs/common';
import { RoomsService } from './services/rooms.service';
import { SocketIoGateway } from './socket-io.gateway';
import { SocketIoService } from './socket-io.service';

@Module({
  providers: [SocketIoGateway, SocketIoService, RoomsService],
})
export class SocketIoModule {}
