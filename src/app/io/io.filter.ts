import { ArgumentsHost, Catch, Logger, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class IoExceptionFilter<T extends WsException> implements WsExceptionFilter {
  private logger = new Logger('IoException');
  public catch(exception: T, host: ArgumentsHost): void {
    this.logger.warn(exception.message);
  }
}
