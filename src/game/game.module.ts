import { Module } from '@nestjs/common';
import { LobbiesModule } from './lobbies/lobbies.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [LobbiesModule],
  providers: [GameService, GameGateway],
  exports: [],
})
export class GameModule {}
