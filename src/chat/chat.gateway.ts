import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatService } from './chat.service';
import { EventName } from '../socket-io/enums/event-name.enum';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage(EventName.messageToServer)
  public handleMsgToServer(@MessageBody() data: ChatMessageDto, @ConnectedSocket() client: Socket): void {
    const response = this.chatService.handleMessageEvent(data, client);
    this.server.emit(response.event, response.data);
  }
}
