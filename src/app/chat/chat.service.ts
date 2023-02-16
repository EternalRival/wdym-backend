import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { IoOutput } from '../io/enums/event-name.enum';
import { ChatMessage } from './classes/chat-message';

@Injectable()
export class ChatService {
  public logger = new Logger(LoggerTag.CHAT);

  public handleMsgToServer(io: Server, socket: Socket, message: string, roomname: string): void {
    const chatMessage = new ChatMessage(socket, message);
    io.to(roomname).emit(IoOutput.chatMessage, chatMessage);

    this.logger.log(`${chatMessage.timestamp}[${roomname}]${chatMessage.username}: ${message}`);
  }
}
