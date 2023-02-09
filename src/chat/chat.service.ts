import { Injectable, Logger } from '@nestjs/common';
import { instrument } from '@socket.io/admin-ui';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { EventName } from '../socket-io/enums/event-name.enum';
import { IoResponse } from '../socket-io/interfaces/io-response.interface';
import { ChatMessage } from './dto/chat-message.dto';

@Injectable()
export class ChatService {
  public logger = new Logger(LoggerTag.CHAT);

  public handleMessageEvent(chatMessage: ChatMessage, client: Socket): IoResponse<ChatMessage> {
    this.logger.log(`💬${chatMessage.username}: ${chatMessage.message}`);
    const timestamp = Date.now();
    return { event: EventName.globalChatMessage, data: { ...chatMessage, timestamp } };
  }

  public afterInit(server: Server): unknown {
    this.logger.log('Chat Server Started');
    instrument(server, { auth: false, mode: 'development' });
    return server;
  }

  public handleConnection(client: Socket, args: unknown[]): unknown {
    this.logger.log(`Client connected: ${client.id}`, ...args);
    return client;
  }

  public handleDisconnect(client: Socket): unknown {
    this.logger.log(`Client disconnected: ${client.id}`);
    return client;
  }
}
