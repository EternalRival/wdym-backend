import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../../shared/enums/logger-tag.enum';
import { IoOutput } from '../../io/enums/event-name.enum';
import { ChatMessage } from './classes/chat-message';

@Injectable()
export class GameChatService {
  public logger = new Logger(LoggerTag.CHAT);

  public handleMsgToServer(io: Server, socket: Socket, room: string, message: string): void {
    const chatMessage = new ChatMessage(socket, room, message);
    io.to(room).emit(IoOutput.chatMessage, chatMessage);

    this.logger.log(`${chatMessage.timestamp}[${room}]${chatMessage.username}: ${message}`);
  }
}
