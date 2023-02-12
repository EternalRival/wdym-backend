import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { Logger } from '@nestjs/common';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { IoGateway } from './io.gateway';
import { IoWsGateway } from './io.decorator';

@IoWsGateway()
export class HooksGateway extends IoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public logger = new Logger(LoggerTag.HOOKS);

  public afterInit(): void {
    instrument(this.io, { auth: false, mode: 'development' });
    this.io.use((socket, next) => {
      socket.on('exception', (...args) => console.log('exceptioned >>', args));
      next();
    });
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
