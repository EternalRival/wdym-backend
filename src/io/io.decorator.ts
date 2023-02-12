import { applyDecorators, UseFilters } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { IoExceptionFilter } from './io.filter';

export function IoWsGateway(): <T extends () => void, Y>(
  target: object | T,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void {
  return applyDecorators(UseFilters(new IoExceptionFilter()), WebSocketGateway({ cors: true }));
}
