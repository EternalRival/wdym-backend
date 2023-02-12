import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { EventName } from '../io/enums/event-name.enum';
import { ChatService } from './chat.service';
import { IoGateway } from '../io/io.gateway';

@WebSocketGateway()
export class ChatGateway extends IoGateway {
  constructor(private chatService: ChatService, private roomService: RoomsService) {
    super();
  }

  @SubscribeMessage(EventName.messageToServer)
  private handleMsgToServer(
    @MessageBody('message') message: string,
    @MessageBody('roomname') roomname: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.chatService.handleMsgToServer(this.io, client, message, roomname);
  }

  @SubscribeMessage(EventName.joinGlobalChat)
  private handleJoinGlobalChat(@ConnectedSocket() client: Socket): void {
    this.roomService.joinRoom(this.io, client, 'GlobalChat');
  }
}
