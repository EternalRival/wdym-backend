import { SubscribeMessage } from '@nestjs/websockets';
import { IoWsGateway } from '../io/io.decorator';
import { IoGateway } from '../io/io.gateway';
import { GameService } from './game.service';

@IoWsGateway()
export class GameGateway extends IoGateway {
  constructor(private gameService: GameService) {
    super();
  }
  /* @SubscribeMessage('message')
  private handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  } */
  @SubscribeMessage('начало')
  private handleStartGameRequest(): void {}
}
