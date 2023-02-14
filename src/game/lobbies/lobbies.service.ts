import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { RoomsService } from '../../rooms/rooms.service';
import { IoOutput } from '../../io/enums/event-name.enum';
import { getChunk } from '../../utils/get-chunk';
import { Lobby } from './classes/lobby';
import { ICreateLobbyData, ILobbyData, ILobbyListOptions } from './interfaces/lobby.interface';
import { Player } from './classes/player';
import { LobbyPrivacyType } from './enum/lobby-privacy-type.enum';

@Injectable()
export class LobbiesService {
  public logger = new Logger('Lobbies');
  private lobbyMap: Map<string, Lobby> = new Map(); // Map<Lobby['uuid'], Lobby>

  constructor(private roomsService: RoomsService) {}

  public createLobby(io: Server, createLobbyData: ICreateLobbyData): ILobbyData {
    const uuid = this.generateUniqueUuid();
    const lobby = new Lobby(uuid, createLobbyData);
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
    return [...this.lobbyMap.values()].every((lobby): boolean => lobby.title !== title);
  }
  private isUuidUnique(uuid: string): boolean {
    return !this.lobbyMap.has(uuid);
  }
  public isPasswordCorrect(uuid: string, password: string): boolean {
    return this.lobbyMap.get(uuid)?.password === password;
  }
  public isLobbyOwner(username: string): boolean {
    return [...this.lobbyMap.values()].some((lobby) => lobby.owner === username);
  }

  public joinLobby(io: Server, socket: Socket, uuid: string, password?: string): Lobby {
    const lobby = this.lobbyMap.get(uuid);
    const { username, image } = socket.handshake.auth;

    if (!(lobby instanceof Lobby)) {
      throw new WsException(`joinLobby: Lobby not found (${uuid})`);
    }
    if (!username) {
      throw new WsException(`joinLobby: Invalid username (${username})`);
    }
    if (lobby.privacyType === LobbyPrivacyType.PRIVATE && lobby.password !== password) {
      throw new WsException(`joinLobby: Incorrect password (${password} !== ${lobby.password})`);
    }

    this.roomsService.joinRoom(io, socket, lobby.uuid);
    if (!lobby.hasPlayer(username)) {
      lobby.addPlayer(new Player(username, image));
      io.to(uuid).emit(IoOutput.joinLobby, lobby.players);
      this.logger.log(`Join lobby: ${username} -> ${lobby.title}(${uuid})`);
    }
    return lobby;
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
    if (!lobby.hasPlayer(username)) {
      throw new WsException(`leaveLobby: Player not found in lobby (${username})`);
    }

    this.roomsService.leaveRoom(socket, uuid);
    io.to(uuid).emit(IoOutput.leaveLobby, lobby.players);
    this.logger.log(`Leave: ${username} -> ${lobby.title}(${uuid})`);
    if (lobby.isEmpty) {
      this.destroyLobby(io, uuid); // TODO реализовать отменяемое удаление с задержкой
    }
    return uuid;
  }

  public destroyLobby(io: Server, uuid: string): string {
    const deleteResult: boolean = this.lobbyMap.delete(uuid);
    if (!deleteResult) {
      throw new WsException(`destroyLobby: lobby not found (${uuid})`);
    }

    this.roomsService.deleteRoom(io, uuid);
    this.logger.log(`Destroy: ${uuid}`);
    return uuid;
  }

  public getLobbyData(uuid: string): Lobby {
    const lobby = this.lobbyMap.get(uuid);
    if (!(lobby instanceof Lobby)) {
      throw new WsException(`getLobbyData: No lobby with uuid ${uuid}`);
    }
    return lobby;
  }

  public getLobbyList(options: ILobbyListOptions): ILobbyData[] {
    this.logger.log(`GetLobbyList: ${JSON.stringify(options)}`);

    const list: Lobby[] = [...this.lobbyMap.values()].filter((lobby) => {
      const privacy: boolean =
        'privacy' in options && options.privacy !== LobbyPrivacyType.ALL ? options.privacy === lobby.privacyType : true;
      const nameContains: boolean =
        'nameContains' in options && options.nameContains ? lobby.title.includes(options.nameContains) : true;

      return !lobby.isStarted && privacy && nameContains;
    });

    const chunk: Lobby[] =
      'chunk' in options && options.chunk ? getChunk(options.chunk.page, options.chunk.limit, list) : list;

    // return chunk.map(([uuid, lobby]): [string, ILobbyData] => [uuid, lobby.lobbyData]);
    return chunk.map((lobby): ILobbyData => lobby.lobbyData); // ILobbyData[]
  }
}
