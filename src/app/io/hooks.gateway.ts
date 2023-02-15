import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { Logger } from '@nestjs/common';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { IoGateway } from './io.gateway';
import { IoWsGateway } from './io.decorator';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@IoWsGateway()
export class HooksGateway extends IoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public logger = new Logger(LoggerTag.HOOKS);

  public afterInit(): void {
    instrument(this.io, { auth: false, mode: 'development' });
    /* this.io.use((socket, next) => {
      socket.on('exception', (...args) => console.log('exceptioned >>', args)); // do nothing
      next();
    }); */
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
