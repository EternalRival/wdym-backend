import { ArgumentsHost, Catch, Logger, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class IoExceptionFilter<T extends WsException> implements WsExceptionFilter {
  private logger = new Logger('IoException');
  public catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const socket: Socket = ctx.getClient();
    /* const data = ctx.getData();
    console.log("clientclientclientclientclientclientclientclient");
    console.log(client);
    console.log('datadatadatadatadatadatadatadatadatadatadatadata');
    console.log(data); */
    // socket.on('error', (err) => console.log(err));
    socket.emit('error', exception);
    this.logger.warn(exception.message);
  }
}
