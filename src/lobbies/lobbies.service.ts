import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { RoomsService } from '../rooms/rooms.service';
import { IoOutput, IoInput } from '../io/enums/event-name.enum';
import { getChunk } from '../utils/get-chunk';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './entities/lobby.entity';
import { Player } from './entities/player.entity';
import { ILobbyListOptions } from './interfaces/lobby-list-options.interface';

@Injectable()
export class LobbiesService {
  public logger = new Logger('Lobbies');
  private lobbyMap: Map<string, Lobby> = new Map(); // Map<Lobby['uuid'], Lobby>

  constructor(private roomsService: RoomsService) {}

  public createLobby(server: Server, createLobbyDto: CreateLobbyDto): Lobby {
    const uuid = this.generateUniqueUuid();
    const lobby = new Lobby(createLobbyDto, uuid);
    this.lobbyMap.set(lobby.uuid, lobby);
    this.logger.log(`Lobby ${lobby.uuid} created`);

    server.emit(IoOutput.createLobby, lobby);
    return lobby;
  }

  private generateUniqueUuid(): string {
    const uuid = randomUUID();
    return this.isUuidUnique(uuid) ? uuid : this.generateUniqueUuid();
  }

  public isLobbyNameUnique(lobbyName: string): boolean {
    return [...this.lobbyMap.values()].every((lobby) => lobby.lobbyName !== lobbyName);
  }
  private isUuidUnique(uuid: string): boolean {
    return !this.lobbyMap.has(uuid);
  }
  public isPasswordCorrect(uuid: string, password: string): boolean {
    return this.lobbyMap.get(uuid)?.password === password;
  }

  public joinLobby(server: Server, socket: Socket, uuid: string, password?: string): Lobby {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = socket.data;
    if (lobby && username && (!lobby.password || lobby.password === password)) {
      if (!(username in lobby.players)) {
        const score = 0;
        const player = new Player({ username, score });
        lobby.players[player.username] = player;
        server.to(lobby.uuid).emit(IoOutput.joinLobby, lobby.players);
        this.logger.log(`Join: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
      }
      this.roomsService.joinRoom(server, socket, lobby.uuid);
      return lobby;
    }
    throw new WsException(`Join failed: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
  }

  public leaveLobby(server: Server, socket: Socket, uuid: string): string {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = socket.data;

    if (lobby && username && username in lobby.players) {
      this.roomsService.leaveRoom(socket, uuid);
      server.to(lobby.uuid).emit(IoOutput.leaveLobby, lobby.players);
      this.logger.log(`Leave: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
      if (lobby.isEmpty) {
        this.destroyLobby(server, uuid);
      }
      return uuid;
    }
    throw new WsException(`Leave failed: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
  }

  public destroyLobby(server: Server, uuid: string): string {
    const deleteResult = this.lobbyMap.delete(uuid);
    if (deleteResult) {
      this.roomsService.deleteRoom(server, uuid);
      this.logger.log(`Destroy: ${uuid}`);
      return uuid;
    }
    throw new WsException(`Destroy failed: ${uuid}`);
  }

  public getLobbyData(uuid: string): Lobby {
    const lobby = this.lobbyMap.get(uuid);
    if (lobby) {
      return lobby;
    }
    throw new WsException(`No lobby with uuid ${uuid}`);
  }

  public getLobbyList(options: ILobbyListOptions): [string, Lobby][] {
    this.logger.log(`GetLobbyList: ${JSON.stringify(options)}`);

    const list = [...this.lobbyMap.entries()].filter(
      ([_, lobby]) =>
        ('isPrivate' in options ? Boolean(lobby.password) === options.isPrivate : true) &&
        ('nameContains' in options ? lobby.lobbyName.includes(options.nameContains) : true),
    );

    return 'chunk' in options ? getChunk(options.chunk.page, options.chunk.limit, list) : list;
  }
}
