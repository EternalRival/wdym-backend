import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
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
  private handleJoinRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() socket: Socket): void {
    this.roomsService.joinRoom(this.io, socket, roomname);
  }
  @SubscribeMessage(EventName.leaveRoomRequest)
  private handleLeaveRoom(@MessageBody('roomname') roomname: string, @ConnectedSocket() socket: Socket): void {
    this.roomsService.leaveRoom(socket, roomname);
  }
  @SubscribeMessage(EventName.getRoomList)
  private handleGetRoomList(@ConnectedSocket() socket: Socket): unknown {
    return this.roomsService.getRoomList(this.io, socket);
  }
}
