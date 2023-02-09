import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IChatMessage } from './interfaces/chat-message.interface';
import { ChatService } from './chat.service';
import { EventName } from '../socket-io/enums/event-name.enum';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage(EventName.messageToServer)
  public handleMsgToServer(@MessageBody() chatMessageDto: IChatMessage): void {
    const { event, data } = this.chatService.handleMessageEvent(chatMessageDto);
    this.server.emit(event, data);
  }
}
