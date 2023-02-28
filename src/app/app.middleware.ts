import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerTag } from './shared/enums/logger-tag.enum';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  public logger = new Logger(LoggerTag.REST);

  public use(req: Request, res: Response, next: NextFunction): void {
    this.logger.log([req.method, req.originalUrl, JSON.stringify(req.body)].join(' '));
    next();
  }
}
