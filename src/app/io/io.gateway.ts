import { OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LoggerTag } from '../shared/enums/logger-tag.enum';
import { IoWsGateway } from './io.decorator';

@IoWsGateway()
export class IoGateway implements OnGatewayInit {
  protected logger = new Logger(LoggerTag.IO);
  @WebSocketServer()
  protected io!: Server;

  public afterInit(): void {
    this.logger.log(`[${this.constructor.name} initialized]`);
  }
}
