import { GameStatus } from '../enum/game-status.enum';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { ICreateLobbyData, ILobby, ILobbyData } from '../interfaces/lobby.interface';
import { Player } from './player';

export class Lobby implements ILobby {
  public readonly uuid!: string;
  public readonly title!: string;
  public readonly password!: string;
  public readonly owner!: string;
  public readonly image!: string;
  public readonly maxPlayers!: number;
  public readonly maxRounds!: number;

  public readonly players: Record<string, Player> = {}; // Record<Player['username'], Player>

  public status: GameStatus = GameStatus.PREPARE;
  public currentRound: number = 1;

  constructor(uuid: string, createLobbyData: ICreateLobbyData) {
    Object.assign(this, { uuid, ...createLobbyData });
  }

  private get playersQuantity(): number {
    return Object.keys(this.players).length;
  }

  public addPlayer(player: Player): void {
    this.players[player.username] = player;
  }
  public removePlayer(username: string): void {
    delete this.players[username]
  }
  public hasPlayer(username: string): boolean {
    return username in this.players;
  }
  public getPlayer(username: string): Player {
    return this.players[username];
  }

  public get isEmpty(): boolean {
    return this.playersQuantity < 1;
  }

  public get privacyType(): LobbyPrivacyType {
    return this.password === '' ? LobbyPrivacyType.PUBLIC : LobbyPrivacyType.PRIVATE;
  }

  public get isStarted(): boolean {
    return ![GameStatus.PREPARE, GameStatus.FINISHED].includes(this.status);
  }

  /** Для отрисовки списка лобби */
  public get lobbyData(): ILobbyData {
    return {
      uuid: this.uuid,
      image: this.image,
      owner: this.owner,
      privacyType: this.privacyType,
      title: this.title,
      playersQuantity: this.playersQuantity,
      maxPlayers: this.maxPlayers,
      maxRounds: this.maxRounds,
    };
  }
}

/* const mock = {
  lobbyName: 'KekLobby',
  password: 'KekPassword',
  lobbyOwner: 'oleg',
  lobbyImage: 'https://kek.com/kek.webp',
  maxUsers: 8,
  rounds: 7,

  players: { oleg: { username: 'oleg', score: 0 } },
};
 */
