import { StreamableFile } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EventName } from '../io/enums/event-name.enum';
import { IoWsGateway } from '../io/io.decorator';
import { IoGateway } from '../io/io.gateway';
import { FileService } from './file.service';

@IoWsGateway()
export class FileGateway extends IoGateway {
  constructor(private fileService: FileService) {
    super();
  }

  @SubscribeMessage(EventName.getRandomMemes)
  private handleGetRandomMemes(
    @MessageBody('quantity') quantity: number,
    @ConnectedSocket() client: Socket,
  ): Promise<StreamableFile[]> {
    return this.fileService.getRandomMemes(this.io, client, quantity);
  }
}
