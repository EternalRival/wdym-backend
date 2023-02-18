import { IPlayer, PlayerBasicInfo, MemeList } from './player.interface';
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
  title: string;
  owner: string;
  image: string;
  password: string;
  maxPlayers: number;
  maxRounds: number;
  timerDelay?: number;
}

export interface ILobby extends ICreateLobbyData {
  readonly uuid: string;
  readonly players: Record<string, IPlayer>;
  status: GameStatus;
  rounds: string[];
}

/** Для отрисовки списка лобби */
export interface ILobbyData {
  uuid: string;
  title: string;
  owner: string;
  image: string;
  privacyType: LobbyPrivacyType;
  players: PlayerBasicInfo[];
  playersCount: number;
  maxPlayers: number;
  isFull: boolean;
  maxRounds: number;
}

/** Для отрисовки игры */
export interface IGameData extends Pick<ILobby, 'players' | 'status' | 'rounds'> {
  currentRound: number;
  memes: MemeList; // {'meme1':['oleg','petr'],'meme2':[egor]}
  votes: MemeList;
  changeStatusDate: number | null;
}
