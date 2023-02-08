import { Injectable, Logger } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './dto/chat-message.dto';

@Injectable()
export class ChatService {
  public logger = new Logger('chat');

  public handleMessageEvent(chatMessage: ChatMessage, client: Socket): WsResponse<ChatMessage> {
    this.logger.log(`💬${chatMessage.username}: ${chatMessage.message}`);
    const timestamp = Date.now();
    return { event: 'globalChatMessage', data: { ...chatMessage, timestamp } };
  }

  public afterInit(server: Server): unknown {
    this.logger.log('Chat Server Started');
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
