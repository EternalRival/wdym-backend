import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { EventName } from '../socket-io/enums/event-name.enum';

@Injectable()
export class ChatService {
  private GLOBAL_CHAT_NAME = 'GlobalChat';

  @WebSocketServer()
  public server: Server;
  public logger = new Logger(LoggerTag.CHAT);

  public handleMsgToServer(server: Server, client: Socket, message: string): void {
    const { username } = client.data;
    const timestamp = Date.now();

    server.to(this.GLOBAL_CHAT_NAME).emit(EventName.chatGlobalMessage, { username, message, timestamp });
    this.logger.log(`${username}: ${message}`);
  }
}