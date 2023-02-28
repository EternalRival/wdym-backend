import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../../shared/enums/logger-tag.enum';

@Injectable()
export class IoRoomsService {
  public logger = new Logger(LoggerTag.ROOMS);

  public joinRoom(io: Server, socket: Socket, roomname: string): void {
    socket.join(roomname);
    this.logger.log(`[${roomname}] Socket joined (${JSON.stringify(socket.handshake.auth)})`);
  }
  public leaveRoom(socket: Socket, roomname: string): void {
    socket.leave(roomname);
    this.logger.log(`[${roomname}] Socket left (${JSON.stringify(socket.handshake.auth)})`);
  }

  public getRoomList(io: Server, socket: Socket): Record<string, string[]> {
    const { rooms } = io.sockets.adapter;
    const entries: [string, string[]][] = [...rooms.entries()].map(([room, sockets]) => [room, [...sockets]]);
    return Object.fromEntries(entries);
  }

  public deleteRoom(io: Server, roomname: string): void {
    io.in(roomname).socketsLeave(roomname);
  }
}
