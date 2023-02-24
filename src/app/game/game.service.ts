import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { Server, Socket } from 'socket.io';
import { IoOutput } from '../io/enums/event-name.enum';
import { Lobby } from './classes/lobby';
import { GamePhase } from './enums/game-phase.enum';
import { Meme, Player, Situation, Vote } from './classes/player';
import { GameLobbiesService } from './lobbies/lobbies.service';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(private lobbiesService: GameLobbiesService) {}

  private situations!: string[];

  public async onModuleInit(): Promise<void> {
    const path = resolve('src', 'public', 'assets', 'json', 'situations.json');
    const string = await readFile(path, 'utf8');
    this.situations = JSON.parse(string);
  }

  public changePhase(io: Server, socket: Socket, uuid: string): string {
    const lobby = this.lobbiesService.getLobby(uuid);
    const { username } = socket.handshake.auth;

    if (!lobby.isOwner(username)) {
      throw new WsException(`${username} is not owner of lobby (${uuid})!`);
    }

    this.chPhase(io, lobby);
    return uuid;
  }
  public pickSituation(io: Server, socket: Socket, uuid: string, situation: Situation): string {
    const lobby = this.lobbiesService.getLobby(uuid);
    const { username } = socket.handshake.auth;

    if (!username) {
      throw new WsException(`Invalid username(${username})!`);
    }
    if (lobby.phase.current !== GamePhase.CHOOSE_SITUATION) {
      throw new WsException(`${username}'s Socket GamePhase is not ${GamePhase.CHOOSE_SITUATION}`);
    }

    const player = lobby.players.get(username);
    if (!(player instanceof Player)) {
      throw new WsException(`${this.constructor.name}.pickSituation: player not found!`);
    }
    player.setSituation(situation);

    return uuid;
  }
  public pickMeme(io: Server, socket: Socket, uuid: string, meme: Meme): string {
    const lobby = this.lobbiesService.getLobby(uuid);
    const { username } = socket.handshake.auth;

    if (!username) {
      throw new WsException(`Invalid username(${username})!`);
    }
    if (lobby.phase.current !== GamePhase.SITUATION) {
      throw new WsException(`${username}'s Socket GamePhase is not ${GamePhase.SITUATION}`);
    }

    const player = lobby.players.get(username);
    if (!(player instanceof Player)) {
      throw new WsException(`${this.constructor.name}.pickMeme: player not found!`);
    }
    player.setMeme(meme);

    if (lobby.isReadyToChangePhase('meme')) {
      this.chPhase(io, lobby);
    }
    return uuid;
  }
  public getVote(io: Server, socket: Socket, uuid: string, vote: Vote): string {
    const lobby = this.lobbiesService.getLobby(uuid);
    const { username } = socket.handshake.auth;

    if (!username) {
      throw new WsException(`Invalid username(${username})!`);
    }
    if (lobby.phase.current !== GamePhase.VOTE) {
      throw new WsException(`${username}'s Socket GamePhase is not ${GamePhase.VOTE}`);
    }

    const player = lobby.players.get(username);
    if (!(player instanceof Player)) {
      throw new WsException(`${this.constructor.name}.getVote: player not found!`);
    }
    player.setVote(vote);

    if (lobby.isReadyToChangePhase('vote')) {
      this.chPhase(io, lobby);
    }
    return uuid;
  }

  // eslint-disable-next-line max-lines-per-function
  private chPhase(io: Server, lobby: Lobby): void {
    if (lobby.isLastRound || lobby.phase.current !== GamePhase.VOTE_RESULTS) {
      lobby.phase.next();
    } else {
      lobby.phase.set(GamePhase.CHOOSE_SITUATION);
    }

    switch (lobby.phase.current) {
      case GamePhase.PREPARE:
        lobby.reset();
        lobby.delayedPhaseChanger.cancel();
        break;
      case GamePhase.CHOOSE_SITUATION:
        lobby.reset();
        lobby.rounds.update();
        // TODO выбор ситуации
        lobby.delayedPhaseChanger.set(() => this.chPhase(io, lobby), lobby.createLobbyData.timerDelayShort * 3);
        break;
      case GamePhase.SITUATION:
        lobby.updateSituation();
        //! тут вызывался createNewRound
        /*   private createNewRound(lobby: Lobby): void {
    const situations = shuffleArray(this.situations);
    const pickedSituation = situations.find((situation) => lobby.rounds.every((round) => round !== situation));
    lobby.rounds.push(pickedSituation ?? situations[0] ?? '');
  } */
        lobby.delayedPhaseChanger.set(() => this.chPhase(io, lobby), lobby.createLobbyData.timerDelay);
        break;
      case GamePhase.VOTE:
        if (lobby.hasNoPickedMemes) {
          this.chPhase(io, lobby);
          return;
        }
        lobby.delayedPhaseChanger.set(() => this.chPhase(io, lobby), lobby.createLobbyData.timerDelay);
        break;
      case GamePhase.VOTE_RESULTS:
        lobby.updateScore();
        lobby.delayedPhaseChanger.set(() => this.chPhase(io, lobby), lobby.createLobbyData.timerDelayShort);
        break;
      case GamePhase.END:
        lobby.delayedPhaseChanger.cancel();
        break;
      default:
    }

    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }
}
