import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../socket-io/enums/event-name.enum';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway {
  @WebSocketServer()
  public server: Server;
  constructor(private chatService: ChatService) {}

  @SubscribeMessage(EventName.messageToServer)
  public handleMsgToServer(@MessageBody('message') message: string, @ConnectedSocket() client: Socket): void {
    this.chatService.handleMsgToServer(this.server, client, message);
  }
}
