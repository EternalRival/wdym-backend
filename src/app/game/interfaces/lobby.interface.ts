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
  maxPlayers: number;
  maxRounds: number;
  title: string;
  owner: string;
  image: string;
  password: string;
}

export interface ILobby {
  readonly TIMER_DELAY: number;

  readonly uuid: string;
  readonly title: string;
  readonly password: string;
  readonly owner: string;
  readonly image: string;
  readonly maxPlayers: number;
  readonly maxRounds: number;

  readonly players: Record<string, IPlayer>;

  status: GameStatus;
  rounds: string[];
}

/** Для отрисовки списка лобби */
export interface ILobbyData {
  uuid: string;
  image: string;
  owner: string;
  privacyType: LobbyPrivacyType;
  title: string;
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
