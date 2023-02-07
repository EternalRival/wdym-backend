import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    Logger.log([req.method, req.originalUrl, JSON.stringify(req.body)].join(' '), 'REST');
    next();
  }
}
