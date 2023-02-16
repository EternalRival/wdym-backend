import { Module } from '@nestjs/common';
import { GameLobbiesModule } from './lobbies/lobbies.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameControlService } from './game-control.service';
import { GameChatModule } from './chat/chat.module';

@Module({
  imports: [GameChatModule, GameLobbiesModule],
  providers: [GameGateway, GameService, GameControlService],
  exports: [],
})
export class GameModule {}
