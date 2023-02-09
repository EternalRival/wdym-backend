import { Injectable, Logger } from '@nestjs/common';
import { instrument } from '@socket.io/admin-ui';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { EventName } from '../socket-io/enums/event-name.enum';
import { IWsResponse } from '../socket-io/interfaces/ws-response.interface';
import { IChatMessage } from './interfaces/chat-message.interface';

@Injectable()
export class ChatService {
  public logger = new Logger(LoggerTag.CHAT);

  public handleMessageEvent(chatMessageDto: IChatMessage): IWsResponse<IChatMessage> {
    this.logger.log(`💬${chatMessageDto.username}: ${chatMessageDto.message}`);
    const timestamp = Date.now();
    return { event: EventName.chatGlobalMessage, data: { ...chatMessageDto, timestamp } };
  }
}
