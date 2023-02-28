import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { IoRoomsService } from '../../io/rooms/rooms.service';
import { IoOutput } from '../../io/enums/event-name.enum';
import { Lobby } from '../classes/lobby';
import { LobbyPrivacyType } from '../enums/lobby-privacy-type.enum';
import { getChunk } from '../../../utils/get-chunk';
import { teapot } from '../../../utils/custom-error';
import { CreateLobbyDto } from '../dto/create-lobby.dto';
import { LobbyListOptionsDto } from '../dto/lobby-list-options.dto';
import { IGameData } from '../interfaces/game-data.interface';
import { ILobbyData } from '../interfaces/lobby-data.interface';

@Injectable()
export class GameLobbiesService {
  public logger = new Logger('Lobbies');
  private lobbyMap: Map<string, Lobby> = new Map();

  constructor(private roomsService: IoRoomsService) {}

  public createLobby(io: Server, createLobbyDto: CreateLobbyDto): ILobbyData {
    const uuid = this.generateUniqueUuid();
    const lobby = new Lobby(uuid, createLobbyDto);
    this.lobbyMap.set(uuid, lobby);
    this.logger.log(`Lobby ${uuid} created`);

    io.emit(IoOutput.createLobby, lobby.lobbyData);
    return lobby.lobbyData;
  }

  private generateUniqueUuid(): string {
    const uuid: string = randomUUID();
    return this.isUuidUnique(uuid) ? uuid : this.generateUniqueUuid();
  }

  public isLobbyTitleUnique(title: string): boolean {
    return [...this.lobbyMap.values()].every((lobby): boolean => lobby.createLobbyData.title !== title);
  }
  private isUuidUnique(uuid: string): boolean {
    return !this.lobbyMap.has(uuid);
  }
  public isPasswordCorrect(uuid: string, password: string): boolean {
    return this.lobbyMap.get(uuid)?.createLobbyData.password === password;
  }
  public isLobbyOwner(username: string, uuid: string): boolean {
    if (!uuid) {
      return [...this.lobbyMap.values()].some((lobby) => lobby.createLobbyData.owner === username);
    }

    const lobby = this.lobbyMap.get(uuid);
    if (!(lobby instanceof Lobby)) {
      throw teapot('Lobby not found');
    }
    return lobby.createLobbyData.owner === username;
  }
  public canUserJoin(username: string, uuid: string): boolean {
    const lobby = this.lobbyMap.get(uuid);
    return lobby instanceof Lobby && (lobby.players.has(username) || !lobby.isFull);
  }

  public joinLobby(io: Server, socket: Socket, uuid: string, password?: string): IGameData {
    const lobby = this.lobbyMap.get(uuid);
    const { username, image } = socket.handshake.auth;

    if (!(lobby instanceof Lobby)) {
      throw new WsException(`joinLobby: Lobby not found (${uuid})`);
    }
    if (!username) {
      throw new WsException(`joinLobby: Invalid username (${username})`);
    }
    if (lobby.privacyType === LobbyPrivacyType.PRIVATE && lobby.createLobbyData.password !== password) {
      throw new WsException(`joinLobby: Incorrect password (${password} !== ${lobby.createLobbyData.password})`);
    }
    if (!this.canUserJoin(username, uuid)) {
      throw new WsException(`joinLobby: Lobby is full (${username})`);
    }

    this.roomsService.joinRoom(io, socket, lobby.uuid);
    if (!lobby.isStarted && !lobby.players.has(username)) {
      lobby.players.add({ username, image });
      io.to(uuid).emit(IoOutput.joinLobby, lobby.gameData);
      io.emit(IoOutput.updateLobby, lobby.lobbyData);
      this.logger.log(`Join lobby: ${username} -> ${lobby.createLobbyData.title}(${uuid})`);
    }
    return lobby.gameData;
  }

  public leaveLobby(io: Server, socket: Socket, uuid: string): string {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = socket.handshake.auth;

    if (!(lobby instanceof Lobby)) {
      throw new WsException(`leaveLobby: Lobby not found: (${uuid})`);
    }
    if (!username) {
      throw new WsException(`leaveLobby: Invalid username (${username})`);
    }
    if (!lobby.players.has(username)) {
      throw new WsException(`leaveLobby: Player not found in lobby (${username})`);
    }

    lobby.players.remove(username);
    this.roomsService.leaveRoom(socket, uuid);

    io.to(uuid).emit(IoOutput.leaveLobby, lobby.gameData);
    io.emit(IoOutput.updateLobby, lobby.lobbyData);
    this.logger.log(`Leave: ${username} -> ${lobby.createLobbyData.title}(${uuid})`);

    this.destroyLobbyIfBroken(io, lobby, 5000);

    return uuid;
  }

  public destroyLobby(io: Server, uuid: string): string {
    const deleteResult: boolean = this.lobbyMap.delete(uuid);
    if (!deleteResult) {
      throw new WsException(`destroyLobby: lobby not found (${uuid})`);
    }

    this.roomsService.deleteRoom(io, uuid);
    this.logger.log(`Destroy: ${uuid}`);

    io.emit(IoOutput.deleteLobby, uuid);
    return uuid;
  }

  public destroyLobbyIfBroken(io: Server, lobby: Lobby, delay: number): void {
    if (!lobby.hasOwner || lobby.isEmpty) {
      setTimeout(() => {
        if (!lobby.hasOwner || lobby.isEmpty) {
          this.destroyLobby(io, lobby.uuid);
        }
      }, delay);
    }
  }

  public getLobby(uuid: string): Lobby {
    const lobby = this.lobbyMap.get(uuid);
    if (!(lobby instanceof Lobby)) {
      throw new WsException(`getLobbyData: No lobby with uuid ${uuid}`);
    }
    return lobby;
  }

  public getLobbyList(options: LobbyListOptionsDto): ILobbyData[] {
    this.logger.log(`GetLobbyList: ${JSON.stringify(options)}`);

    const list: Lobby[] = [...this.lobbyMap.values()].filter((lobby) => {
      const privacy: boolean =
        'privacy' in options && options.privacy !== LobbyPrivacyType.ALL ? options.privacy === lobby.privacyType : true;
      const nameContains: boolean =
        'nameContains' in options && options.nameContains
          ? lobby.createLobbyData.title.includes(options.nameContains)
          : true;

      return !lobby.isStarted && privacy && nameContains;
    });

    const chunk: Lobby[] =
      'chunk' in options && options.chunk ? getChunk(options.chunk.page, options.chunk.limit, list) : list;

    return chunk.map((lobby): ILobbyData => lobby.lobbyData);
  }

  public clearEmptyLobbies(io: Server): void {
    this.lobbyMap.forEach((lobby) => {
      if (lobby.isEmpty) {
        this.destroyLobby(io, lobby.uuid);
      }
    });
  }
}
