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
import { RoomsService } from './services/rooms.service';

@WebSocketGateway({ cors: { origin: true } })
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;
  constructor(private readonly socketIoService: SocketIoService, private readonly roomsService: RoomsService) {}

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
    this.roomsService.joinRoom(client, roomname);
  }
  @SubscribeMessage(EventName.leaveRoom)
  public handleLeaveRoom(@MessageBody() roomname: string, @ConnectedSocket() client: Socket): void {
    this.roomsService.leaveRoom(client, roomname);
  }
  @SubscribeMessage(EventName.getRoomList)
  public handleGetRoomList(@ConnectedSocket() client: Socket): unknown {
    return this.roomsService.getRoomList(this.server, client);
  }
}
