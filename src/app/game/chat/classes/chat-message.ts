import { Socket } from 'socket.io';
import { IChatMessage } from '../interfaces/chat-message.interface';

export class ChatMessage implements IChatMessage {
  public timestamp: number;
  public image: string;
  public username: string;
  constructor(socket: Socket, public room: string, public message: string) {
    const { image, username } = socket.handshake.auth;
    this.timestamp = Date.now();
    this.image = image;
    this.username = username;
  }
}
