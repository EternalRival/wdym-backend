import { Injectable } from '@nestjs/common';
import { Lobby } from './classes/lobby';
import { Player } from './classes/player';
import { GameStatus } from './enum/game-status.enum';
import { ILobby } from './interfaces/lobby.interface';
import { PlayerVote } from './interfaces/player.interface';

@Injectable()
export class GameControlService {
  public nextStatus(lobby: Lobby): void {
    switch (lobby.status) {
      case GameStatus.PREPARE:
        lobby.setStatus(GameStatus.KARTISHKI);
        break;
      case GameStatus.KARTISHKI:
        lobby.setStatus(GameStatus.VOTE);
        break;
      case GameStatus.VOTE:
        lobby.setStatus(GameStatus.VOTE_RESULTS);
        break;
      case GameStatus.VOTE_RESULTS:
        lobby.setStatus(lobby.currentRound < lobby.maxRounds ? GameStatus.KARTISHKI : GameStatus.FINISHED);
        break;
      case GameStatus.FINISHED:
        lobby.setStatus(GameStatus.KARTISHKI); // TODO возможно заменить на GameStatus.PREPARE
        break;
      default:
    }
  }

  public getSituation(): unknown {
    throw new Error('не реализовано');
  }
  public setPlayerMeme(player: Player, meme: string | null): void {
    player.setMeme(meme);
  }
  public setPlayerVote(player: Player, vote: PlayerVote | null): void {
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
    lobby.setCurrentRound(1);
    Object.values(lobby.players).forEach((player: Player) => {
      player.setScore(0);
      player.setMeme(null);
      player.setVote(null);
    });
  }

  private mockLobby: ILobby = {
    players: {
      '1111': {
        username: '1111',
        image: 'https://cs5.pikabu.ru/post_img/2014/12/25/8/1419515300_641817002.gif',
        score: 0,
        meme: null,
        vote: null,
      },
    },
    status: 0,
    currentRound: 1,
    uuid: 'f67408dc-ad8c-49a9-89cd-75e4847126a8',
    maxPlayers: 2,
    maxRounds: 1,
    title: 'awdawd',
    owner: '1111',
    image: 'https://cs5.pikabu.ru/post_img/2014/12/25/8/1419515300_641817002.gif',
    password: '',
  };
}
