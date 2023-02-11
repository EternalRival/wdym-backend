import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { SocketIoService } from './socket-io.service';

@WebSocketGateway({ cors: { origin: true } })
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
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
}
