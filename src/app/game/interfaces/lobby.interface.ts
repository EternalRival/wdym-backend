import { IPlayer, PlayerBasicInfo, MemeList } from './player.interface';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { GameStatus } from '../enum/game-status.enum';
import { GameMode } from '../enum/game-mode.enum';

export interface ILobbyListOptions {
  chunk?: {
    page: number;
    limit: number;
  };
  privacy?: LobbyPrivacyType;
  nameContains?: string;
}

export interface ICreateLobbyData {
  mode: GameMode;
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
export interface ILobbyData
  extends Pick<ILobby, 'uuid' | 'title' | 'owner' | 'image' | 'mode' | 'maxPlayers' | 'maxRounds'> {
  privacyType: LobbyPrivacyType;
  players: PlayerBasicInfo[];
  playersCount: number;
  isFull: boolean;
}

/** Для отрисовки игры */
export interface IGameData extends Pick<ILobby, 'players' | 'status' | 'rounds' | 'mode'> {
  currentRound: number;
  memes: MemeList; // {'meme1':['oleg','petr'],'meme2':[egor]}
  votes: MemeList;
  changeStatusDate: number | null;
}
