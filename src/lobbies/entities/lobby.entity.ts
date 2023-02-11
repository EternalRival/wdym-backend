import { CreateLobbyDto } from '../dto/create-lobby.dto';
import { Player } from './player.entity';

export class Lobby implements CreateLobbyDto {
  public readonly lobbyName: string;
  public readonly password: string;
  public readonly lobbyOwner: string;
  public readonly lobbyImage: string;
  public readonly maxUsers: number;
  public readonly rounds: number;

  public readonly players: Record<string, Player> = {}; // Record<Player['username'], Player>

  constructor(createLobbyDto: CreateLobbyDto, public readonly uuid: string) {
    Object.assign(this, createLobbyDto);
  }

  public get data(): this {
    return this;
  }
}
