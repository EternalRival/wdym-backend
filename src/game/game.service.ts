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
    if (lobby instanceof Lobby) {
      const player = lobby.getPlayer(username);
      if (player instanceof Player) {
        return player;
      }
      throw new WsException(`${GameService.name}.getPlayer: player not found!`);
    }
    throw new WsException(`${GameService.name}.getPlayer: lobby not found!`);
  }
}
