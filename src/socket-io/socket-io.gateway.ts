import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { Logger } from '@nestjs/common';
import { LoggerTag } from '../logger/enums/logger-tag.enum';

@WebSocketGateway({ cors: true })
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public logger = new Logger(LoggerTag.SOCKET_IO);
  @WebSocketServer()
  private server: Server;

  public afterInit(): void {
    instrument(this.server, { auth: false, mode: 'development' });
   /*  this.server.use((socket, next) => {
      socket.on('exception', (...args) => console.log('exceptioned >>', args));
      next();
    }); */
    this.logger.log('Socket Server Started');
  }
  public handleConnection(@ConnectedSocket() client: Socket): void {
    try {
      const { username } = client.handshake.auth;
      Object.assign(client.data, { username });
      this.logger.log(`Client connected: ${username}`);
    } catch (error) {
      this.logger.warn(error.message);
    }
  }
  public handleDisconnect(@ConnectedSocket() client: Socket): void {
    const { username } = client.data;
    this.logger.log(`Client disconnected: ${username}`);
  }
}
