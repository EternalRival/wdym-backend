import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoInput } from '../io/enums/event-name.enum';
import { IoWsGateway } from '../io/io.decorator';
import { IoGateway } from '../io/io.gateway';
import { GameService } from './game.service';
import { PlayerVote } from './interfaces/player.interface';

@IoWsGateway()
export class GameGateway extends IoGateway {
  constructor(private gameService: GameService) {
    super();
  }

  @SubscribeMessage(IoInput.startGame)
  private handleStartGameRequest(@MessageBody(ParseUUIDPipe) uuid: string): string {
    return this.gameService.startGame(this.io, uuid);
  }

  @SubscribeMessage(IoInput.pickMeme)
  private handlePickMemeRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('meme') meme: string,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.gameService.pickMeme(this.io, socket, uuid, meme);
  }

  @SubscribeMessage(IoInput.getVote)
  private handleGetVoteRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('vote') vote: PlayerVote,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.gameService.getVote(this.io, socket, uuid, vote);
  }
}
