import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../io/enums/event-name.enum';
import { IoWsGateway } from '../io/io.decorator';
import { IoGateway } from '../io/io.gateway';
import { RoomsService } from './rooms.service';

@IoWsGateway()
export class RoomsGateway extends IoGateway {
  constructor(private readonly roomsService: RoomsService) {
    super();
  }

  @SubscribeMessage(EventName.joinRoomRequest)
  private handleJoinRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() client: Socket): void {
    this.roomsService.joinRoom(this.io, client, roomname);
  }
  @SubscribeMessage(EventName.leaveRoomRequest)
  private handleLeaveRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() client: Socket): void {
    this.roomsService.leaveRoom(client, roomname);
  }
  @SubscribeMessage(EventName.getRoomList)
  private handleGetRoomList(@ConnectedSocket() client: Socket): unknown {
    return this.roomsService.getRoomList(this.io, client);
  }
}
