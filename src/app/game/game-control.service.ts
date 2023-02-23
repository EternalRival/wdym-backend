import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { shuffleArray } from '../../utils/randomize';
import { Lobby } from './classes/lobby';
import { Player } from './classes/player';
import { GamePhase } from './enum/game-phase.enum';
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

  private nextPhase(lobby: Lobby): void {
    switch (lobby.phase) {
      case GamePhase.PREPARE:
        lobby.setPhase(GamePhase.SITUATION);
        break;
      case GamePhase.SITUATION:
        lobby.setPhase(lobby.hasMemes ? GamePhase.VOTE : GamePhase.VOTE_RESULTS);
        break;
      case GamePhase.VOTE:
        lobby.setPhase(GamePhase.VOTE_RESULTS);
        break;
      case GamePhase.VOTE_RESULTS:
        lobby.setPhase(lobby.currentRound < lobby.maxRounds ? GamePhase.SITUATION : GamePhase.END);
        break;
      case GamePhase.END:
        lobby.setPhase(GamePhase.PREPARE);
        break;
      default:
    }
  }

  private createNewRound(lobby: Lobby): void {
    const situations = shuffleArray(this.situations);
    const pickedSituation = situations.find((situation) => lobby.rounds.every((round) => round !== situation));
    lobby.rounds.push(pickedSituation ?? situations[0] ?? '');
  }

  private updatePlayerScore(player: Player, plus: number): void {
    player.setScore(player.score + plus);
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

  public reset(lobby: Lobby): void {
    Object.values(lobby.players).forEach((player: Player) => {
      player.setMeme(null);
      player.setVote(null);
      if (lobby.phase === GamePhase.PREPARE) {
        player.setScore(0);
      }
    });
    if (lobby.phase === GamePhase.PREPARE) {
      lobby.delayedChangePhase.cancel();
      lobby.cleanRounds();
    }
  }

  public changeCurrentPhase(lobby: Lobby): void {
    this.nextPhase(lobby);

    switch (lobby.phase) {
      case GamePhase.VOTE_RESULTS:
        this.updateLobbyScore(lobby);
        break;
      case GamePhase.SITUATION:
        this.reset(lobby);
        this.createNewRound(lobby);
        break;
      case GamePhase.PREPARE:
        this.reset(lobby);
        break;
      default:
    }
  }
}
