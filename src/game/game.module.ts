import { Module } from '@nestjs/common';
import { LobbiesModule } from './lobbies/lobbies.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameControlService } from './game-control.service';

@Module({
  imports: [LobbiesModule],
  providers: [GameGateway, GameService, GameControlService],
  exports: [],
})
export class GameModule {}
