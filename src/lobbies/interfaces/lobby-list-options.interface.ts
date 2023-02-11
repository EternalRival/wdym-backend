export interface ILobbyListOptions {
  chunk?: {
    page: number;
    limit: number;
  };
  isPrivate?: boolean;
  nameContains?: string;
}
