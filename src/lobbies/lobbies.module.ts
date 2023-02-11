import { Module } from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import { LobbiesGateway } from './lobbies.gateway';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  providers: [LobbiesService, LobbiesGateway],
})
export class LobbiesModule {}
