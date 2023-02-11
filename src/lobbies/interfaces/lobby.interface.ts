import { IPlayer } from './player.interface';

export interface ILobby {
  lobbyName: string;
  password: string;
  lobbyOwner: string;
  lobbyImage: string;
  maxUsers: number;
  rounds: number;
  players: Record<IPlayer['username'], IPlayer>;
}
