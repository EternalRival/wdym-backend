import { Module } from '@nestjs/common';
import { IoRoomsModule } from '../../io/rooms/rooms.module';
import { GameChatGateway } from './chat.gateway';
import { GameChatService } from './chat.service';

@Module({
  imports: [IoRoomsModule],
  providers: [GameChatGateway, GameChatService],
})
export class GameChatModule {}
