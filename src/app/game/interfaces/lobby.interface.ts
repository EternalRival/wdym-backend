import { IPlayer } from './player.interface';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { GameStatus } from '../enum/game-status.enum';
import { Round } from '../classes/round';

export interface ILobbyListOptions {
  chunk?: {
    page: number;
    limit: number;
  };
  privacy?: LobbyPrivacyType;
  nameContains?: string;
}

export interface ICreateLobbyData {
  maxPlayers: number;
  maxRounds: number;
  title: string;
  owner: string;
  image: string;
  password: string;
}

export interface ILobby {
  /*   uuid: string;
  title: string;
  password: string;
  owner: string;
  image: string;
  maxPlayers: number;
  maxRounds: number;
  players: Record<string, IPlayer>;
  status: GameStatus;
  currentRound: number; */

  readonly uuid: string;
  readonly title: string;
  readonly password: string;
  readonly owner: string;
  readonly image: string;
  readonly maxPlayers: number;
  readonly maxRounds: number;

  readonly players: Record<string, IPlayer>;

  status: GameStatus;
  rounds: Round[];
}

export interface ILobbyData {
  uuid: string;
  image: string;
  owner: string;
  privacyType: LobbyPrivacyType;
  title: string;
  playersQuantity: number;
  maxPlayers: number;
  maxRounds: number;
}

export interface IGameData extends Pick<ILobby, 'players' | 'status' | 'rounds'> {
  currentRound: number;
}
