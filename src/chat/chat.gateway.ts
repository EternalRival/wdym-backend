import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { EventName } from '../socket-io/enums/event-name.enum';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private chatService: ChatService, private roomService: RoomsService) {}

  @SubscribeMessage(EventName.messageToServer)
  public handleMsgToServer(@MessageBody('message') message: string, @ConnectedSocket() client: Socket): void {
    this.chatService.handleMsgToServer(this.server, client, message);
  }

  @SubscribeMessage(EventName.joinGlobalChat)
  public handleJoinGlobalChat(@ConnectedSocket() client: Socket): void {
    this.roomService.joinRoom(client, 'GlobalChat');
  }
}
