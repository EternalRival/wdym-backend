import { Player } from '../classes/player';
import { GameMode } from '../enums/game-mode.enum';
import { LobbyPrivacyType } from '../enums/lobby-privacy-type.enum';

export interface ILobbyData {
  uuid: string;
  image: string;
  owner: string;
  privacyType: LobbyPrivacyType.PRIVATE | LobbyPrivacyType.PUBLIC;
  title: string;
  mode: GameMode;
  players: Pick<Player, 'username' | 'image'>[];
  playersCount: number;
  maxPlayers: number;
  isFull: boolean;
  maxRounds: number;
}
