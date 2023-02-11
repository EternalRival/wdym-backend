export class CreateLobbyDto {
  public readonly lobbyName: string;
  public readonly password: string;
  public readonly lobbyOwner: string;
  public readonly lobbyImage: string;
  public readonly maxUsers: number;
  public readonly rounds: number;
}
