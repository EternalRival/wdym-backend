import { LobbyPrivacyType } from '../enums/lobby-privacy-type.enum';
import { CreateLobbyDto } from '../dto/create-lobby.dto';
import { PhaseSwitcher } from './phase-switcher';
import { GamePhase } from '../enums/game-phase.enum';
import { PlayerList } from './playerList';
import { IGameData, ChoiceList, Choice } from '../interfaces/game-data.interface';
import { ILobbyData } from '../interfaces/lobby-data.interface';
import { DelayedFunction } from '../../../utils/delayed-function';
import { SituationsPicker } from './situations-picker';
import { RoundCounter } from './round-counter';

export class Lobby {
  constructor(public readonly uuid: string, public readonly createLobbyData: CreateLobbyDto) {}
  public players = new PlayerList();
  public phase = new PhaseSwitcher();
  public situations = new SituationsPicker();
  public delayedPhaseChanger = new DelayedFunction();
  public rounds = new RoundCounter();

  public get privacyType(): LobbyPrivacyType.PRIVATE | LobbyPrivacyType.PUBLIC {
    return this.createLobbyData.password === '' ? LobbyPrivacyType.PUBLIC : LobbyPrivacyType.PRIVATE;
  }

  public get isEmpty(): boolean {
    return this.players.count < 1;
  }
  public get isFull(): boolean {
    return this.players.count >= this.createLobbyData.maxPlayers;
  }
  public get isStarted(): boolean {
    return this.phase.current !== GamePhase.PREPARE;
  }
  public get isLastRound(): boolean {
    return this.rounds.current >= this.createLobbyData.maxRounds;
  }
  public isReadyToChangePhase(property: Choice): boolean {
    const { list, count } = this.players;
    return list.reduce((counter, player) => counter + +(player[property] !== null), 0) >= count;
    // return list.reduce((counter, player) => (player[property] === null ? counter : counter + 1), 0) >= count;
  }
  public isOwner(username: string): boolean {
    return this.createLobbyData.owner === username;
  }

  public updateSituation(): void {
    throw new Error('Method not implemented.');
  }
  public getMemes(property: Choice): ChoiceList {
    return this.players.list.reduce((list, player) => {
      const prop = player[property];
      if (prop !== null) {
        if (!(prop in list)) {
          Object.assign(list, { [prop]: [] });
        }
        list[prop].push(player.username);
      }
      return list;
    }, {} as ChoiceList);
  }
  public get hasNoPickedMemes(): boolean {
    return Object.keys(this.getMemes('meme')).length < 1;
  }
  public updateScore(): void {
    const memes = this.getMemes('meme');
    const votes = Object.entries(this.getMemes('vote'));

    votes.forEach(([meme, playerNames]) => {
      if (playerNames.length > 0) {
        memes[meme].forEach((playerName) => {
          const player = this.players.get(playerName);
          player?.setScore(player.score + playerNames.length);
        });
      }
    });
  }
  public reset(): void {
    const isHardReset = this.phase.current === GamePhase.PREPARE;
    this.players.list.forEach((player) => {
      player.setSituation(null);
      player.setMeme(null);
      player.setVote(null);
      if (isHardReset) {
        player.setScore(0);
      }
    });
    if (isHardReset) {
      this.delayedPhaseChanger.cancel();
      this.rounds.update({ reset: true });
      this.situations.clear();
    }
  }

  /** Для отрисовки списка лобби */
  public get lobbyData(): ILobbyData {
    return {
      uuid: this.uuid,
      image: this.createLobbyData.image,
      owner: this.createLobbyData.owner,
      privacyType: this.privacyType,
      title: this.createLobbyData.title,
      mode: this.createLobbyData.mode,
      players: this.players.listShort,
      playersCount: this.players.count,
      maxPlayers: this.createLobbyData.maxPlayers,
      isFull: this.isFull,
      maxRounds: this.createLobbyData.maxRounds,
    };
  }

  /** Для отрисовки игры */
  public get gameData(): IGameData {
    return {
      mode: this.createLobbyData.mode,
      phase: this.phase.current,
      players: this.players.list,
      situations: [''],
      situation: this.situations.current,
      memes: this.getMemes('meme'),
      votes: this.getMemes('vote'),
      currentRound: this.rounds.current,
      changePhaseDate: this.delayedPhaseChanger.triggerDate,
    };
  }
}
