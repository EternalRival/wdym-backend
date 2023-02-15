import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
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

  public func(): void{
    /* this.gameControlService */
  }
}
