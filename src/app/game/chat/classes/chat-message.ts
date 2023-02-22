import { Socket } from 'socket.io';
import { ChatMessageDto } from '../dto/chat-message.dto';

export class ChatMessage implements ChatMessageDto {
  public timestamp: number;
  public image: string;
  public username: string;
  public message: string;
  constructor(socket: Socket, message: string) {
    const { image, username } = socket.handshake.auth;
    this.timestamp = Date.now();
    this.image = image;
    this.username = username;
    this.message = message;
  }
}
