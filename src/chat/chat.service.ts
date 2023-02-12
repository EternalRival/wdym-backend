import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { EventName } from '../socket-io/enums/event-name.enum';

@Injectable()
export class ChatService {
  private GLOBAL_CHAT_NAME = 'GlobalChat';
  public logger = new Logger(LoggerTag.CHAT);

  public handleMsgToServer(server: Server, client: Socket, message: string, roomname: string): void {
    const { username } = client.data;
    const timestamp = Date.now();

    server.to(roomname || this.GLOBAL_CHAT_NAME).emit(EventName.chatGlobalMessage, { username, message, timestamp });
    if (!roomname) {
      this.logger.log(`${username}: ${message}`);
    }
  }
}
