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
  maxUsers: number;
  rounds: number;
  lobbyName: string;
  lobbyOwner: string;
  lobbyImage: string;
  password: string;
}

export interface ILobbyData {
  uuid: string;
  lobbyImage: string;
  lobbyOwner: string;
  privacyType: LobbyPrivacyType;
  lobbyName: string;
  currentUsers: number;
  maxUsers: number;
  rounds: number;
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
