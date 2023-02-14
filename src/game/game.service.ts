import { WsException } from '@nestjs/websockets';
import { Lobby } from './lobbies/classes/lobby';
import { Player } from './lobbies/classes/player';
import { LobbiesService } from './lobbies/lobbies.service';

export class GameService {
  constructor(private lobbiesService: LobbiesService) {}

  private getLobby(uuid: string): Lobby {
    return this.lobbiesService.getLobbyData(uuid);
  }

  private getPlayer(uuid: string, username: string): Player {
    const lobby = this.getLobby(uuid);
    if (!(lobby instanceof Lobby)) {
      throw new WsException(`${this.constructor.name}.getPlayer: lobby not found!`);
    }

    const player = lobby.getPlayer(username);
    if (!(player instanceof Player)) {
      throw new WsException(`${this.constructor.name}.getPlayer: player not found!`);
    }
    return player;
  }
}
