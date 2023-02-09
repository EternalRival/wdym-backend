import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './dto/chat-message.dto';
import { ChatService } from './chat.service';
import { EventName } from '../socket-io/enums/event-name.enum';
import { IoResponse } from '../socket-io/interfaces/io-response.interface';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage(EventName.messageToServer)
  public handleMsgToServer(@MessageBody() data: ChatMessage, @ConnectedSocket() client: Socket): void {
    const response = this.chatService.handleMessageEvent(data, client);
    this.server.emit(response.event, response.data);
  }

  public afterInit(server: Server): IoResponse {
    const event = EventName.gatewayInit;
    const data = this.chatService.afterInit(server);
    return { event, data };
  }

  public handleConnection(@ConnectedSocket() client: Socket, ...args: unknown[]): IoResponse {
    const event = EventName.gatewayConnection;
    const data = this.chatService.handleConnection(client, args);
    return { event, data };
  }
  public handleDisconnect(@ConnectedSocket() client: Socket): IoResponse {
    const event = EventName.gatewayDisconnect;
    const data = this.chatService.handleDisconnect(client);
    return { event, data };
  }
}
