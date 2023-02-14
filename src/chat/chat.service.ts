import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoggerTag } from '../logger/enums/logger-tag.enum';
import { IoOutput, IoInput } from '../io/enums/event-name.enum';

@Injectable()
export class ChatService {
  public logger = new Logger(LoggerTag.CHAT);

  public handleMsgToServer(io: Server, socket: Socket, message: string, roomname: string): void {
    const { username } = socket.data;
    const timestamp = Date.now();

    io.to(roomname).emit(IoOutput.chatMessage, { username, message, timestamp });

    this.logger.log(`${timestamp}[${roomname}]${username}: ${message}`);
  }
}
