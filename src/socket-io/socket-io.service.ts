import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { IJoinRoomData } from './interfaces/join-room.interface';

@Injectable()
export class SocketIoService {
  @WebSocketServer()
  public server: Server;
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

  public get rooms(): Map<string, Set<string>> {
    return this.server.sockets.adapter.rooms;
  }

  public async joinRoom(client: Socket, roomname: string): Promise<void> {
    const { username } = client.data;

    await client.join(roomname);
    this.logger.log(`User ${username} joined to ${roomname}`);
  }
}
