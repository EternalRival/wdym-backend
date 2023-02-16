import { ConnectedSocket, MessageBody, SubscribeMessage, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { IoInput } from '../io/enums/event-name.enum';
import { ChatService } from './chat.service';
import { IoGateway } from '../io/io.gateway';
import { IoWsGateway } from '../io/io.decorator';

@IoWsGateway()
export class ChatGateway extends IoGateway {
  private GLOBAL_CHAT_NAME = 'GlobalChat';

  constructor(private chatService: ChatService, private roomService: RoomsService) {
    super();
  }

  @SubscribeMessage(IoInput.chatMessage)
  private handleMsgToServer(
    @MessageBody('message') message: string,
    @MessageBody('roomname') roomname: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.chatService.handleMsgToServer(this.io, socket, message, roomname ?? this.GLOBAL_CHAT_NAME);
  }

  public handleConnection(@ConnectedSocket() socket: Socket): void {
    socket.join(this.GLOBAL_CHAT_NAME);
  }
  /* @SubscribeMessage('kek')
  private kek(): string {
    throw new WsException('KEKERRORRRRRRRRRRR');
    return 'aaaaa';
  } */
}
