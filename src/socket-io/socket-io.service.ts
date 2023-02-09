import { Injectable, Logger } from '@nestjs/common';
import { instrument } from '@socket.io/admin-ui';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';

@Injectable()
export class SocketIoService {
  public logger = new Logger(LoggerTag.SOCKET_IO);
  public afterInit(server: Server): unknown {
    this.logger.log('Chat Server Started');
    instrument(server, { auth: false, mode: 'development' });
    return server;
  }

  public handleConnection(client: Socket, args: unknown[]): unknown {
    this.logger.log(`Client connected: ${client.id}`, ...args);
    return client;
  }

  public handleDisconnect(client: Socket): unknown {
    this.logger.log(`Client disconnected: ${client.id}`);
    return client;
  }
}
