import { Injectable, Logger } from '@nestjs/common';
import { instrument } from '@socket.io/admin-ui';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { EventName } from '../socket-io/enums/event-name.enum';
import { IoResponse } from '../socket-io/interfaces/io-response.interface';
import { ChatMessageDto } from './dto/chat-message.dto';

@Injectable()
export class ChatService {
  public logger = new Logger(LoggerTag.CHAT);

  public handleMessageEvent(chatMessageDto: ChatMessageDto, client: Socket): IoResponse<ChatMessageDto> {
    this.logger.log(`💬${chatMessageDto.username}: ${chatMessageDto.message}`);
    const timestamp = Date.now();
    return { event: EventName.chatGlobalMessage, data: { ...chatMessageDto, timestamp } };
  }
}
