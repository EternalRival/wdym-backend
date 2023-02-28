import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoInput } from '../io/enums/event-name.enum';
import { IoWsGateway } from '../io/io.decorator';
import { IoGateway } from '../io/io.gateway';
import { Meme, Situation, Vote } from './classes/player';
import { GameService } from './game.service';

@IoWsGateway()
export class GameGateway extends IoGateway {
  constructor(private gameService: GameService) {
    super();
  }

  @SubscribeMessage(IoInput.changePhase)
  private handleChangePhaseRequest(
    @MessageBody(ParseUUIDPipe) uuid: string,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.gameService.changePhase(this.io, socket, uuid);
  }

  @SubscribeMessage(IoInput.pickSituation)
  private handlePickSituationRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('situation') situation: Situation,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.gameService.pickSituation(this.io, socket, uuid, situation);
  }

  @SubscribeMessage(IoInput.pickMeme)
  private handlePickMemeRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('meme') meme: Meme,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.gameService.pickMeme(this.io, socket, uuid, meme);
  }

  @SubscribeMessage(IoInput.getVote)
  private handleGetVoteRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('vote') vote: Vote,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.gameService.getVote(this.io, socket, uuid, vote);
  }
}
