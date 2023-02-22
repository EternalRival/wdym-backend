import { ArgumentsHost, Catch, Logger, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoOutput } from './enums/event-name.enum';

@Catch()
export class IoExceptionFilter<T extends WsException> implements WsExceptionFilter {
  private logger = new Logger('IoException');
  public catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const socket: Socket = ctx.getClient();

    socket.emit(IoOutput.error, exception);
    this.logger.warn(exception.message);
  }
}
