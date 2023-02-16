import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IoOutput } from '../io/enums/event-name.enum';
import { Lobby } from './classes/lobby';
import { Player } from './classes/player';
import { GameStatus } from './enum/game-status.enum';
import { GameControlService } from './game-control.service';
import { Meme } from './interfaces/player.interface';
import { LobbiesService } from './lobbies/lobbies.service';

@Injectable()
export class GameService {
  constructor(private lobbiesService: LobbiesService, private gameControlService: GameControlService) {}

  private getLobby(uuid: string): Lobby {
    const lobby = this.lobbiesService.getLobbyData(uuid);
    if (!(lobby instanceof Lobby)) {
      throw new WsException(`${this.constructor.name}.getPlayer: lobby not found!`);
    }
    return lobby;
  }

  private getPlayer(lobby: Lobby, username: string): Player {
    const player: Player = lobby.getPlayer(username);
    if (!(player instanceof Player)) {
      throw new WsException(`${this.constructor.name}.getPlayer: player not found!`);
    }
    return player;
  }

  private changePhaseAlert(io: Server, lobby: Lobby): void {
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }

  public startGame(io: Server, uuid: string): string {
    const lobby = this.getLobby(uuid);
    this.gameControlService.resetGame(lobby);
    this.gameControlService.nextStatus(lobby);

    this.startRound(io, lobby);
    return uuid;
  }

  public startRound(io: Server, lobby: Lobby): void {
    this.gameControlService.createNewRound(lobby);

    this.changePhaseAlert(io, lobby);
  }

  public pickMeme(io: Server, socket: Socket, uuid: string, meme: Meme): string {
    const lobby = this.getLobby(uuid);
    const { username } = socket.handshake.auth;

    if (!username) {
      throw new WsException(`Invalid username (${username})!`);
    }
    if (lobby.status !== GameStatus.SITUATION) {
      throw new WsException(`${username}'s Socket GameStatus is not ${GameStatus.SITUATION}!`);
    }

    const player = this.getPlayer(lobby, username);
    player.setMeme(meme);

    if (lobby.isReadyToChangeGameStatus('meme')) {
      this.gameControlService.nextStatus(lobby);
      this.changePhaseAlert(io, lobby);
    }
    return uuid;
  }

  public getVote(io: Server, socket: Socket, uuid: string, vote: Meme): string {
    const lobby = this.getLobby(uuid);
    const { username } = socket.handshake.auth;

    if (!username) {
      throw new WsException(`Invalid username (${username})!`);
    }
    if (lobby.status !== GameStatus.VOTE) {
      throw new WsException(`${username}'s Socket GameStatus is not ${GameStatus.VOTE}!`);
    }

    const player = this.getPlayer(lobby, username);
    player.setVote(vote);

    if (lobby.isReadyToChangeGameStatus('vote')) {
      this.gameControlService.nextStatus(lobby);
      this.changePhaseAlert(io, lobby);
    }
    return uuid;
  }
}
/* 
Lobby: {
  players: {
    oleg: {
      image: 'image-url',
      username: 'oleg',
      score: 0,
      meme: 'meme-url', // | null
      vote: 'meme-url', // | null
    },
  },
  status: 'prepare', // |'situation'|'vote'|'vote-results'|'end'
  rounds: [
    {
      situation: 'lorem',
      winner: {
        username: 'petr',
        meme: 'meme-url',
      },
    },
  ],
} */
