import { DelayedFunction } from '../../../utils/delayed-function';
import { GameStatus } from '../enum/game-status.enum';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { ICreateLobbyData, IGameData, ILobby, ILobbyData } from '../interfaces/lobby.interface';
import { Meme, MemeList } from '../interfaces/player.interface';
import { Player } from './player';

export class Lobby implements ILobby {
  public readonly uuid: string;
  public title: string = 'Game';
  public owner: string = 'Player';
  public image: string = '';
  public password: string = '';
  public maxPlayers: number = 3;
  public maxRounds: number = 1;
  public timerDelay: number = 30 * 1000;

  public readonly players: Record<string, Player> = {}; // Record<Player['username'], Player>

  public status: GameStatus = GameStatus.PREPARE;
  public rounds: string[] = [];

  public delayedChangePhase = new DelayedFunction(this.timerDelay);

  constructor(uuid: string, createLobbyData: ICreateLobbyData) {
    this.uuid = uuid;
    const properties: (keyof ICreateLobbyData)[] = [
      'title',
      'owner',
      'image',
      'password',
      'maxPlayers',
      'maxRounds',
      'timerDelay',
    ];
    properties.forEach((property) => {
      if (property in createLobbyData && createLobbyData[property]) {
        Object.assign(this, { [property]: createLobbyData[property] });
      }
    });
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
  public get isFull(): boolean {
    return this.playersCount >= this.maxPlayers;
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
  public isReadyToChangeGameStatus(property: keyof Pick<Player, 'meme' | 'vote'>): boolean {
    const players: Player[] = Object.values(this.players);
    return players.reduce((counter, player) => counter + +(player[property] !== null), 0) >= this.playersCount; // (player[property] === null ? counter : counter + 1)
  }

  public get currentRound(): number {
    return this.rounds.length;
  }
  public cleanRounds(): void {
    this.rounds.length = 0;
  }

  public getMemes(property: keyof Pick<Player, 'meme' | 'vote'>): MemeList {
    return Object.values(this.players).reduce((list, player) => {
      const prop: Meme = player[property];
      if (prop !== null) {
        if (!(prop in list)) {
          Object.assign(list, { [prop]: [] });
        }
        list[prop].push(player.username);
      }
      return list;
    }, {} as MemeList);
  }

  /** Для отрисовки списка лобби */
  public get lobbyData(): ILobbyData {
    return {
      uuid: this.uuid,
      image: this.image,
      owner: this.owner,
      privacyType: this.privacyType,
      title: this.title,
      players: Object.values(this.players).map((player) => ({ username: player.username, image: player.image })),
      playersCount: this.playersCount,
      maxPlayers: this.maxPlayers,
      isFull: this.isFull,
      maxRounds: this.maxRounds,
    };
  }

  /** Для отрисовки игры */
  public get gameData(): IGameData {
    return {
      status: this.status,
      players: this.players,
      rounds: this.rounds,
      memes: this.getMemes('meme'),
      votes: this.getMemes('vote'),
      currentRound: this.currentRound,
      changeStatusDate: this.delayedChangePhase.triggerDate,
    };
  }
}
