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
import { instrument } from '@socket.io/admin-ui';
import { EventName } from './enums/event-name.enum';
import { SocketIoService } from './socket-io.service';

@WebSocketGateway({ cors: { origin: true } })
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;
  constructor(private readonly socketIoService: SocketIoService) {}

  public afterInit(server: Server): void {
    instrument(server, { auth: false, mode: 'development' });
    this.socketIoService.afterInit();
  }
  public handleConnection(@ConnectedSocket() client: Socket): void {
    this.socketIoService.handleConnection(client);
  }
  public handleDisconnect(@ConnectedSocket() client: Socket): void {
    this.socketIoService.handleDisconnect(client);
  }

  @SubscribeMessage(EventName.joinRoom)
  public handleJoinRoom(@MessageBody() roomname: string, @ConnectedSocket() client: Socket): void {
    this.socketIoService.joinRoom(client, roomname);
  }
}
