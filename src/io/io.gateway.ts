import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { IoWsGateway } from './io.decorator';

@IoWsGateway()
export class IoGateway {
  protected logger = new Logger(LoggerTag.IO);
  @WebSocketServer()
  protected io: Server;
}
