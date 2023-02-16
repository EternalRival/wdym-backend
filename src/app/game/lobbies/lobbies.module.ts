import { Module } from '@nestjs/common';
import { GameLobbiesService } from './lobbies.service';
import { GameLobbiesGateway } from './lobbies.gateway';
import { IoRoomsModule } from '../../io/rooms/rooms.module';
import { GameLobbiesController } from './lobbies.controller';

@Module({
  imports: [IoRoomsModule],
  providers: [GameLobbiesService, GameLobbiesGateway],
  controllers: [GameLobbiesController],
  exports: [GameLobbiesService],
})
export class GameLobbiesModule {}
