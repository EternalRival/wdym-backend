import { Module } from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import { LobbiesGateway } from './lobbies.gateway';
import { RoomsModule } from '../../rooms/rooms.module';
import { LobbiesController } from './lobbies.controller';

@Module({
  imports: [RoomsModule],
  providers: [LobbiesService, LobbiesGateway],
  exports: [LobbiesService],
  controllers: [LobbiesController],
})
export class LobbiesModule {}
