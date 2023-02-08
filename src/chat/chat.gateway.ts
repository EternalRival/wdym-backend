import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './dto/chat-message.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('messageToServer')
  public handleMsgToServer(@MessageBody() data: ChatMessage, @ConnectedSocket() client: Socket): void {
    const response = this.chatService.handleMessageEvent(data, client);
    this.server.emit(response.event, response.data);
    // from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
  }

  public afterInit(server: Server): WsResponse {
    const event = 'gatewayInit';
    const data = this.chatService.afterInit(server);
    return { event, data };
  }

  public handleConnection(@ConnectedSocket() client: Socket, ...args: unknown[]): WsResponse {
    const event = 'gatewayConnection';
    const data = this.chatService.handleConnection(client, args);
    return { event, data };
  }
  public handleDisconnect(@ConnectedSocket() client: Socket): WsResponse {
    const event = 'gatewayDisconnect';
    const data = this.chatService.handleDisconnect(client);
    return { event, data };
  }
}
