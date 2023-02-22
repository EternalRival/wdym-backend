import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { shuffle } from '../../utils/randomize';
import { Lobby } from './classes/lobby';
import { Player } from './classes/player';
import { GameStatus } from './enum/game-status.enum';
import { Meme } from './dto/player.dto';
import { GameLobbiesService } from './lobbies/lobbies.service';

@Injectable()
export class GameControlService implements OnModuleInit {
  private situations!: string[];

  public async onModuleInit(): Promise<void> {
    this.situations = await this.readSituations();
  }
  private async readSituations(): Promise<string[]> {
    const path = resolve('src', 'public', 'assets', 'json', 'situations.json');
    const string = await readFile(path, 'utf8');
    return JSON.parse(string);
  }

  constructor(private lobbiesService: GameLobbiesService) {}

  public getLobby(uuid: string): Lobby {
    const lobby = this.lobbiesService.getLobbyData(uuid);
    if (!(lobby instanceof Lobby)) {
      throw new WsException(`${this.constructor.name}.getPlayer: lobby not found!`);
    }
    return lobby;
  }
  public getPlayer(lobby: Lobby, username: string): Player {
    const player: Player = lobby.getPlayer(username);
    if (!(player instanceof Player)) {
      throw new WsException(`${this.constructor.name}.getPlayer: player not found!`);
    }
    return player;
  }

  private nextStatus(lobby: Lobby): void {
    switch (lobby.status) {
      case GameStatus.PREPARE:
        lobby.setStatus(GameStatus.SITUATION);
        break;
      case GameStatus.SITUATION:
        lobby.setStatus(lobby.hasMemes ? GameStatus.VOTE : GameStatus.VOTE_RESULTS);
        break;
      case GameStatus.VOTE:
        lobby.setStatus(GameStatus.VOTE_RESULTS);
        break;
      case GameStatus.VOTE_RESULTS:
        lobby.setStatus(lobby.currentRound < lobby.maxRounds ? GameStatus.SITUATION : GameStatus.END);
        break;
      case GameStatus.END:
        lobby.setStatus(GameStatus.SITUATION); // TODO возможно заменить на GameStatus.PREPARE
        break;
      default:
    }
  }

  private createNewRound(lobby: Lobby): void {
    this.resetRound(lobby);
    const situations = shuffle(this.situations);
    const pickedSituation = situations.find((situation) => lobby.rounds.every((round) => round !== situation));
    lobby.rounds.push(pickedSituation ?? situations[0] ?? '');
  }
  public setPlayerMeme(player: Player, meme: Meme): void {
    player.setMeme(meme);
  }
  public setPlayerVote(player: Player, vote: Meme): void {
    player.setVote(vote);
  }

  private updatePlayerScore(player: Player, plus: number): void {
    player.setScore(player.score + plus);
  }
  private resetPlayerScore(player: Player): void {
    player.setScore(0);
  }
  private updateLobbyScore(lobby: Lobby): void {
    const memes = lobby.getMemes('meme');
    const votes = lobby.getMemes('vote');

    Object.entries(votes).forEach(([meme, playerNames]) => {
      if (playerNames.length > 0) {
        memes[meme].forEach((playerName) => {
          const player = lobby.getPlayer(playerName);
          this.updatePlayerScore(player, playerNames.length);
        });
      }
    });
  }

  public resetGame(lobby: Lobby): void {
    lobby.setStatus(GameStatus.PREPARE);
    this.resetRound(lobby, { hardReset: true });
  }

  //?

  private resetRound(lobby: Lobby, options?: { hardReset: boolean }): void {
    Object.values(lobby.players).forEach((player: Player) => {
      this.setPlayerMeme(player, null);
      this.setPlayerVote(player, null);
      if (options?.hardReset === true) {
        this.resetPlayerScore(player);
      }
    });
    if (options?.hardReset === true) {
      lobby.cleanRounds();
    }
  }

  public changePhase(lobby: Lobby): void {
    this.nextStatus(lobby);

    switch (lobby.status) {
      case GameStatus.VOTE_RESULTS:
        this.updateLobbyScore(lobby);
        break;
      case GameStatus.SITUATION:
        this.createNewRound(lobby);
        break;
      default:
    }
  }
}
