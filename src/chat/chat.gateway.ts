import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { IChatMessage } from './interfaces/chat-message.interface';
import { EventName } from '../socket-io/enums/event-name.enum';
import { LoggerTag } from '../logger/enums/logger-tag.enum';

@WebSocketGateway({ cors: { origin: true } })
export class ChatGateway {
  @WebSocketServer()
  public server: Server;
  public logger = new Logger(LoggerTag.CHAT);

  @SubscribeMessage(EventName.messageToServer)
  public handleMsgToServer(@MessageBody() chatMessageDto: IChatMessage, @ConnectedSocket() client: Socket): void {
    const { username } = client.handshake.auth;
    const { message } = chatMessageDto;
    const timestamp = Date.now();

    // return from([1, 2, 3]).pipe(map((data) => ({ event: 'kek', data })));

    this.server.emit(EventName.chatGlobalMessage, { username, message, timestamp });
  }
}
