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
import { Player } from './player';

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
  public get hasOwner(): boolean {
    return this.players.has(this.createLobbyData.owner);
  }
  public get isStarted(): boolean {
    return ![GamePhase.PREPARE, GamePhase.END].includes(this.phase.current);
  }
  public get isLastRound(): boolean {
    return this.rounds.current >= this.createLobbyData.maxRounds;
  }
  public isReadyToChangePhase(property: Choice): boolean {
    const { list, count } = this.players;
    return list.reduce((counter, player) => counter + +(player[property] !== null), 0) >= count;
  }
  public isOwner(username: string): boolean {
    return this.createLobbyData.owner === username;
  }

  public getSituationChoices(): ChoiceList<Pick<Player, 'username' | 'image'>> {
    return this.players.list.reduce((list, player) => {
      const { username, image, situation } = player;
      if (situation === null) {
        return list;
      }

      if (!(situation in list)) {
        Object.assign(list, { [situation]: [] });
      }
      list[situation].push({ username, image });

      return list;
    }, {} as ChoiceList<Pick<Player, 'username' | 'image'>>);
  }

  public getChoices(property: Choice): ChoiceList {
    return this.players.list.reduce((list, player) => {
      const prop = player[property];
      if (prop === null) {
        return list;
      }

      if (!(prop in list)) {
        Object.assign(list, { [prop]: [] });
      }
      list[prop].push(player.username);

      return list;
    }, {} as ChoiceList);
  }
  public get hasNoPickedMemes(): boolean {
    return Object.keys(this.getChoices('meme')).length < 1;
  }
  public updateScore(): void {
    const memes = this.getChoices('meme');

    Object.entries(this.getChoices('vote'))
      .map<[string, number]>(([meme, playerNames]) => [meme, playerNames.length])
      .filter(([meme, score]) => meme && meme in memes && score > 0)
      .forEach(([meme, score]) =>
        memes[meme].forEach((playerName) => {
          const player = this.players.get(playerName);
          player?.setScore(player.score + score);
        }),
      );
  }
  public updateSituation(): void {
    const choices = this.getChoices('situation');
    const entries = Object.entries(choices);
    const [winner] = entries.sort(([, a], [, b]) => (a.length > b.length ? -1 : 1)).map((entry) => entry[0]);
    this.situations.setPlayed(winner);
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
    this.situations.clear('options');
    if (isHardReset) {
      this.rounds.update({ reset: true });
      this.situations.clear('played');
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
      situationOptions: this.situations.options,
      situation: this.situations.current,
      situations: this.getSituationChoices(),
      memes: this.getChoices('meme'),
      votes: this.getChoices('vote'),
      currentRound: this.rounds.current,
      changePhaseDate: this.delayedPhaseChanger.triggerDate,
    };
  }
}
