import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../socket-io/enums/event-name.enum';
import { RoomsService } from './rooms.service';

@WebSocketGateway({ cors: { origin: true } })
export class RoomsGateway {
  @WebSocketServer()
  public server: Server;
  constructor(private readonly roomsService: RoomsService) {}

  @SubscribeMessage(EventName.joinRoom)
  public handleJoinRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() client: Socket): void {
    this.roomsService.joinRoom(client, roomname);
  }
  @SubscribeMessage(EventName.leaveRoom)
  public handleLeaveRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() client: Socket): void {
    this.roomsService.leaveRoom(client, roomname);
  }
  @SubscribeMessage(EventName.getRoomList)
  public handleGetRoomList(@ConnectedSocket() client: Socket): unknown {
    return this.roomsService.getRoomList(this.server, client);
  }
}
