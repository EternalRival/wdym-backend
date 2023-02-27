import { ConnectedSocket, MessageBody, SubscribeMessage, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoRoomsService } from '../../io/rooms/rooms.service';
import { IoInput } from '../../io/enums/event-name.enum';
import { GameChatService } from './chat.service';
import { IoGateway } from '../../io/io.gateway';
import { IoWsGateway } from '../../io/io.decorator';

@IoWsGateway()
export class GameChatGateway extends IoGateway {
  private GLOBAL_CHAT_NAME = 'GlobalChat';

  constructor(private chatService: GameChatService, private roomService: IoRoomsService) {
    super();
  }

  @SubscribeMessage(IoInput.chatMessage)
  private handleMsgToServer(
    @MessageBody('message') message: string,
    @MessageBody('room') room: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.chatService.handleMsgToServer(this.io, socket, message, room ?? this.GLOBAL_CHAT_NAME);
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
