import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../io/enums/event-name.enum';
import { RoomsService } from './rooms.service';

@WebSocketGateway()
export class RoomsGateway {
  @WebSocketServer()
  private server: Server;
  constructor(private readonly roomsService: RoomsService) {}

  @SubscribeMessage(EventName.joinRoomRequest)
  private handleJoinRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() client: Socket): void {
    this.roomsService.joinRoom(this.server, client, roomname);
  }
  @SubscribeMessage(EventName.leaveRoomRequest)
  private handleLeaveRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() client: Socket): void {
    this.roomsService.leaveRoom(client, roomname);
  }
  @SubscribeMessage(EventName.getRoomList)
  private handleGetRoomList(@ConnectedSocket() client: Socket): unknown {
    return this.roomsService.getRoomList(this.server, client);
  }
}
