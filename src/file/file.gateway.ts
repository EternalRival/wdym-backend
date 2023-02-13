import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoInput } from '../io/enums/event-name.enum';
import { IoWsGateway } from '../io/io.decorator';
import { IoGateway } from '../io/io.gateway';
import { FileService } from './file.service';

@IoWsGateway()
export class FileGateway extends IoGateway {
  constructor(private fileService: FileService) {
    super();
  }

  @SubscribeMessage(IoInput.randomMemesRequest)
  private handleGetRandomMemes(
    @MessageBody('quantity') quantity: number,
    @ConnectedSocket() socket: Socket,
  ): Promise<string[]> {
    return this.fileService.getRandomMemes(this.io, socket, quantity);
  }
}
