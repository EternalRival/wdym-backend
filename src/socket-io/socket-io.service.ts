import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';

@Injectable()
export class SocketIoService {
  public logger = new Logger(LoggerTag.SOCKET_IO);

  public afterInit(): void {
    this.logger.log('Socket Server Started');
  }
  public handleConnection(client: Socket): void {
    try {
      const { username } = client.handshake.auth;
      Object.assign(client.data, { username });
      this.logger.log(`Client connected: ${username}`);
    } catch (error) {
      this.logger.warn(error.message);
    }
  }
  public handleDisconnect(client: Socket): void {
    const { username } = client.data;
    this.logger.log(`Client disconnected: ${username}`);
  }
}
