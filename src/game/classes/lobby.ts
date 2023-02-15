import { GameStatus } from '../enum/game-status.enum';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { ICreateLobbyData, IGameData, ILobby, ILobbyData } from '../interfaces/lobby.interface';
import { Player } from './player';
import { Round } from './round';

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
  public rounds: Round[] = [];

  constructor(uuid: string, createLobbyData: ICreateLobbyData) {
    this.uuid = uuid;
    this.maxPlayers = createLobbyData.maxPlayers;
    this.maxRounds = createLobbyData.maxRounds;
    this.title = createLobbyData.title;
    this.owner = createLobbyData.owner;
    this.image = createLobbyData.image;
    this.password = createLobbyData.password;
  }

  public get privacyType(): LobbyPrivacyType {
    return this.password === '' ? LobbyPrivacyType.PUBLIC : LobbyPrivacyType.PRIVATE;
  }
  public get isStarted(): boolean {
    return ![GameStatus.PREPARE, GameStatus.END].includes(this.status);
  }
  public get isEmpty(): boolean {
    return this.playersCount < 1;
  }

  private get playersCount(): number {
    return Object.keys(this.players).length;
  }
  public addPlayer(player: Player): void {
    this.players[player.username] = player;
  }
  public removePlayer(username: string): void {
    delete this.players[username];
  }
  public hasPlayer(username: string): boolean {
    return username in this.players;
  }
  public getPlayer(username: string): Player {
    return this.players[username];
  }

  public setStatus(status: GameStatus): void {
    this.status = status;
  }
  private isReadyToChangeGameStatus(property: keyof Pick<Player, 'meme' | 'vote'>): boolean {
    const players: Player[] = Object.values(this.players);
    return players.reduce((counter, player) => counter + +(player[property] !== null), 0) >= this.playersCount; // (player[property] === null ? counter : counter + 1)
  }

  public get currentRound(): number {
    return this.rounds.length;
  }
  public resetRounds(): void {
    this.rounds.length = 0;
  }

  public resetGame(): void {
    this.setStatus(GameStatus.PREPARE);
    Object.values(this.players).forEach((player: Player) => {
      player.setScore(0);
      player.setMeme(null);
      player.setVote(null);
    });
    this.resetRounds();
  }

  /** Для отрисовки списка лобби */
  public get lobbyData(): ILobbyData {
    return {
      uuid: this.uuid,
      image: this.image,
      owner: this.owner,
      privacyType: this.privacyType,
      title: this.title,
      playersQuantity: this.playersCount, // TODO обговорить переименование
      maxPlayers: this.maxPlayers,
      maxRounds: this.maxRounds,
    };
  }

  /** Для отрисовки игры */
  public get gameData(): IGameData {
    return {
      status: this.status,
      players: this.players,
      rounds: this.rounds,
      currentRound: this.currentRound,
    };
  }
}