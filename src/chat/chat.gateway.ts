import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway /* implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect */ {
  @WebSocketServer()
  public server: Server;
  public logger = new Logger('💬');

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  public kek(@MessageBody() data: string): unknown {
    this.logger.log(data);
    return '🌭'; // from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
  }

  /*   @SubscribeMessage('message')
  public handleMessage(client: Socket, payload: string): string {
    this.server.emit('message', payload);
    return 'Hello world!';
  } */

  public afterInit(server: Server): void {
    this.logger.log(`Init: ${server}`);
  }
  public handleConnection(client: Socket, ...args: unknown[]): void {
    this.logger.log(`Client connected: ${client} > ${args.join(';')}`);
  }
  public handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client}`);
  }
}
