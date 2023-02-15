import { SubscribeMessage } from '@nestjs/websockets';
import { IoWsGateway } from '../io/io.decorator';
import { IoGateway } from '../io/io.gateway';

@IoWsGateway()
export class GameGateway extends IoGateway {
  /* @SubscribeMessage('message')
  private handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  } */
}
