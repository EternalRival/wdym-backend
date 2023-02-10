import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';

@Injectable()
export class SocketIoService {
  public logger = new Logger(LoggerTag.SOCKET_IO);

  public afterInit(): void {
    this.logger.log('Socket Server Started');
  }
  public handleConnection(client: Socket): void {
    const { username } = client.handshake.auth;
    Object.assign(client.data, { username });
    this.logger.log(`Client connected: ${username}`);
  }
  public handleDisconnect(client: Socket): void {
    const { username } = client.data;
    this.logger.log(`Client disconnected: ${username}`);
  }

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

  public getRoomList(server: Server, client: Socket): Record<string, string[]> /* : [string, string[]][] */ {
    const { rooms } = server.sockets.adapter;
    const entries: [string, string[]][] = [...rooms.entries()].map(([room, clients]) => [room, [...clients]]);
    return Object.fromEntries(entries);
  }
}
