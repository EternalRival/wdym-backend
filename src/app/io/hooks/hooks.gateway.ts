import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { Logger } from '@nestjs/common';
import { LoggerTag } from '../../shared/enums/logger-tag.enum';
import { IoGateway } from '../io.gateway';
import { IoWsGateway } from '../io.decorator';

@IoWsGateway()
export class IoHooksGateway extends IoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public logger = new Logger(LoggerTag.HOOKS);

  public afterInit(): void {
    instrument(this.io, { auth: false, mode: 'development' });

    this.logger.log(`[${this.constructor.name} initialized]`);
  }

  public async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
    socket.setMaxListeners(0);
    this.logger.log(`Socket connected to server: ${JSON.stringify(socket.handshake.auth)}`);
  }

  public handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this.logger.log(`Socket disconnected to server: ${JSON.stringify(socket.handshake.auth)}`);
  }
}
