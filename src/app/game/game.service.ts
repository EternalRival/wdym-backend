import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IoOutput } from '../io/enums/event-name.enum';
import { Lobby } from './classes/lobby';
import { Player } from './classes/player';
import { GameControlService } from './game-control.service';
import { LobbiesService } from './lobbies/lobbies.service';

@Injectable()
export class GameService {
  constructor(private lobbiesService: LobbiesService, private gameControlService: GameControlService) {}

  private getLobby(uuid: string): Lobby {
    return this.lobbiesService.getLobbyData(uuid);
  }

  private getPlayer(uuid: string, username: string): Player {
    const lobby: Lobby = this.getLobby(uuid);
    if (!(lobby instanceof Lobby)) {
      throw new WsException(`${this.constructor.name}.getPlayer: lobby not found!`);
    }

    const player: Player = lobby.getPlayer(username);
    if (!(player instanceof Player)) {
      throw new WsException(`${this.constructor.name}.getPlayer: player not found!`);
    }
    return player;
  }

  private changePhaseAlert(io: Server, lobby: Lobby): void {
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }

  public startGame(io: Server, uuid: string): void {
    const lobby = this.getLobby(uuid);
    this.gameControlService.resetGame(lobby);
    this.gameControlService.nextStatus(lobby);
    this.changePhaseAlert(io, lobby);
  }

  public startRound(io: Server, uuid: string): void {
    const lobby = this.getLobby(uuid);
    /* this.gameControlService */
  }
}
