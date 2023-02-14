import { IPlayer } from './player.interface';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { GameStatus } from '../enum/game-status.enum';

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
  maxRound: number;
  title: string;
  owner: string;
  image: string;
  password: string;
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

export interface ILobby {
  uuid: string;
  title: string;
  password: string;
  owner: string;
  image: string;
  maxPlayers: number;
  maxRounds: number;
  players: Record<string, IPlayer>;
  status: GameStatus;
  currentRound: number;
}
