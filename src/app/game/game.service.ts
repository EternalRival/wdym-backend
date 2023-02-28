import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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

  private possibleSituations!: string[];

  public async onModuleInit(): Promise<void> {
    const path = resolve('src', 'public', 'assets', 'json', 'situations.json');
    const string = await readFile(path, 'utf8');
    this.possibleSituations = JSON.parse(string);
  }

  public changePhase(io: Server, socket: Socket, uuid: string): string {
    const lobby = this.lobbiesService.getLobby(uuid);
    const { username } = socket.handshake.auth;

    if (!lobby.isOwner(username)) {
      throw new WsException(`${username} is not owner of lobby (${uuid})!`);
    }

    this.nextPhase(io, lobby);
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

    io.to(uuid).emit(IoOutput.pickSituation, lobby.gameData);
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
      this.nextPhase(io, lobby);
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
      this.nextPhase(io, lobby);
    }
    return uuid;
  }

  private nextPhase(io: Server, lobby: Lobby): void {
    if (lobby.isLastRound || lobby.phase.current !== GamePhase.VOTE_RESULTS) {
      lobby.phase.next();
    } else {
      lobby.phase.set(GamePhase.CHOOSE_SITUATION);
    }

    switch (lobby.phase.current) {
      case GamePhase.PREPARE:
        this.handlePreparePhase(io, lobby);
        break;
      case GamePhase.CHOOSE_SITUATION:
        this.handleChooseSituationPhase(io, lobby);
        break;
      case GamePhase.SITUATION:
        this.handleSituationPhase(io, lobby);
        break;
      case GamePhase.VOTE:
        this.handleVotePhase(io, lobby);
        break;
      case GamePhase.VOTE_RESULTS:
        this.handleVoteResultsPhase(io, lobby);
        break;
      case GamePhase.END:
        this.handleEndPhase(io, lobby);
        break;
      default:
    }

    this.removeMissingPlayers(io, lobby);
  }

  private handlePreparePhase(io: Server, lobby: Lobby): void {
    lobby.reset();
    lobby.delayedPhaseChanger.cancel();
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }
  private handleChooseSituationPhase(io: Server, lobby: Lobby): void {
    lobby.reset();
    lobby.rounds.update();
    lobby.situations.setOptions(this.possibleSituations);
    lobby.delayedPhaseChanger.set(() => this.nextPhase(io, lobby), lobby.createLobbyData.timerDelayChooseSituations);
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }
  private handleSituationPhase(io: Server, lobby: Lobby): void {
    lobby.updateSituation();
    lobby.delayedPhaseChanger.set(() => this.nextPhase(io, lobby), lobby.createLobbyData.timerDelay);
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }
  private handleVotePhase(io: Server, lobby: Lobby): void {
    if (lobby.hasNoPickedMemes) {
      this.nextPhase(io, lobby);
      return;
    }
    lobby.delayedPhaseChanger.set(() => this.nextPhase(io, lobby), lobby.createLobbyData.timerDelay);
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }
  private handleVoteResultsPhase(io: Server, lobby: Lobby): void {
    lobby.updateScore();
    lobby.delayedPhaseChanger.set(() => this.nextPhase(io, lobby), lobby.createLobbyData.timerDelayVoteResults);
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
  }
  private handleEndPhase(io: Server, lobby: Lobby): void {
    lobby.delayedPhaseChanger.cancel();
    io.to(lobby.uuid).emit(IoOutput.changePhase, lobby.gameData);
    io.emit(IoOutput.updateLobby, lobby.lobbyData);
  }

  private async removeMissingPlayers(io: Server, lobby: Lobby): Promise<void> {
    const connectedPlayers = (await io.in(lobby.uuid).fetchSockets()).map((socket) => socket.handshake.auth.username);
    const missingPlayers = lobby.players.list.filter(({ username }) => !connectedPlayers.includes(username));

    if (missingPlayers.length > 0) {
      missingPlayers.forEach(({ username }) => lobby.players.remove(username));
      io.to(lobby.uuid).emit(IoOutput.leaveLobby, lobby.gameData);
      io.emit(IoOutput.updateLobby, lobby.lobbyData);
      this.lobbiesService.destroyLobbyIfBroken(io, lobby, 5000);
    }
  }
}
