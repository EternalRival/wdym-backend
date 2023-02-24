import { Module } from '@nestjs/common';
import { GameChatModule } from './chat/chat.module';
import { GameLobbiesModule } from './lobbies/lobbies.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [GameChatModule, GameLobbiesModule],
  providers: [GameGateway, GameService],
  exports: [],
})
export class GameModule {}
