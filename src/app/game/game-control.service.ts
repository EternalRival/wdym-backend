import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { shuffle } from '../../utils/randomize';
import { Lobby } from './classes/lobby';
import { Player } from './classes/player';
import { GameStatus } from './enum/game-status.enum';
import { Meme } from './interfaces/player.interface';

@Injectable()
export class GameControlService implements OnModuleInit {
  public situations!: string[];

  public async onModuleInit(): Promise<void> {
    this.situations = await this.readSituations();
  }
  private async readSituations(): Promise<string[]> {
    const path = resolve('src', 'public', 'assets', 'json', 'situations.json');
    const string = await readFile(path, 'utf8');
    return JSON.parse(string);
  }

  public nextStatus(lobby: Lobby): void {
    switch (lobby.status) {
      case GameStatus.PREPARE:
        lobby.setStatus(GameStatus.SITUATION);
        break;
      case GameStatus.SITUATION:
        lobby.setStatus(GameStatus.VOTE);
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

  public createNewRound(lobby: Lobby): void {
    const { rounds } = lobby;
    const situations = shuffle(this.situations);

    const pickedSituation = situations.find((situation) => rounds.every((round) => round !== situation));

    rounds.push(pickedSituation ?? situations[0] ?? '');
  }
  public setPlayerMeme(player: Player, meme: Meme): void {
    player.setMeme(meme);
  }
  public setPlayerVote(player: Player, vote: Meme): void {
    player.setVote(vote);
  }
  //? что тут?
  public displayVoteResults(): unknown {
    throw new Error('не реализовано');
  }
  public updatePlayerScore(player: Player, plus: number): void {
    player.setScore(player.score + plus);
  }
  public resetPlayerScore(player: Player): void {
    player.setScore(0);
  }
  //? а тут что?
  public displayEnding(): unknown {
    throw new Error('не реализовано');
  }
  public resetGame(lobby: Lobby): void {
    lobby.resetGame();
  }
}
