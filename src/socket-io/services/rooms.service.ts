import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../../logger/enums/logger-tag.enum';

@Injectable()
export class RoomsService {
  public logger = new Logger(LoggerTag.ROOMS);

  public joinRoom(client: Socket, roomname: string): void {
    const { username } = client.data;

    client.join(roomname);
    this.logger.log(`User ${username} joined to ${roomname}`);
  }
  public leaveRoom(client: Socket, roomname: string): void {
    const { username } = client.data;

    client.leave(roomname);
    this.logger.log(`User ${username} left ${roomname}`);
  }

  public getRoomList(server: Server, client: Socket): Record<string, string[]> {
    const { rooms } = server.sockets.adapter;
    const entries: [string, string[]][] = [...rooms.entries()].map(([room, clients]) => [room, [...clients]]);
    return Object.fromEntries(entries);
  }

  public deleteRoom(server: Server, roomname: string): void {
    server.in(roomname).socketsLeave(roomname);
  }
}
