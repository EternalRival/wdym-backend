import { WsResponse } from '@nestjs/websockets';
import { EventName } from '../enums/event-name.enum';

export interface IWsResponse<T = WsResponse['data']> extends WsResponse<T> {
  event: EventName;
}
