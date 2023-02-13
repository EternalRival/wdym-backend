import { LobbyListOptionsPrivacy } from '../enum/lobby-list-options.enum';

export interface ILobbyListOptions {
  chunk?: {
    page: number;
    limit: number;
  };
  privacy?: LobbyListOptionsPrivacy;
  nameContains?: string;
}
