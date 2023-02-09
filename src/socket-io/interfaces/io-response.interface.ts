import { WsResponse } from '@nestjs/websockets';
import { EventName } from '../enums/event-name.enum';

export interface IoResponse<T = WsResponse['data']> extends WsResponse<T> {
  event: EventName;
}
