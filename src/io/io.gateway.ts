import { ConnectedSocket, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters } from '@nestjs/common';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { IoExceptionFilter } from './io.filter';

@UseFilters(new IoExceptionFilter())
@WebSocketGateway({ cors: true })
export class IoGateway {
  protected logger = new Logger(LoggerTag.IO);
  @WebSocketServer()
  protected io: Server;
}
