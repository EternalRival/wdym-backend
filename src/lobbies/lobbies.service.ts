import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { EventName } from '../socket-io/enums/event-name.enum';
import { getChunk } from '../utils/get-chunk';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './entities/lobby.entity';
import { Player } from './entities/player.entity';
import { LobbyListOptions } from './types/lobby-list-options.type';

@Injectable()
export class LobbiesService {
  private logger = new Logger('Lobbies');
  private lobbyMap: Map<string, Lobby> = new Map(); // Map<Lobby['uuid'], Lobby>

  constructor(private roomsService: RoomsService) {}

  public createLobby(server: Server, createLobbyDto: CreateLobbyDto): Lobby {
    const uuid = this.generateUniqueUuid();
    const lobby = new Lobby(createLobbyDto, uuid);
    this.lobbyMap.set(lobby.uuid, lobby);
    this.logger.log(`Lobby ${lobby.uuid} created`);

    server.emit(EventName.lobbyCreated, lobby);
    return lobby;
  }

  private generateUniqueUuid(): string {
    const uuid = randomUUID();
    return this.isUuidUnique(uuid) ? uuid : this.generateUniqueUuid();
  }

  public isUuidUnique(uuid: string): boolean {
    return !this.lobbyMap.has(uuid);
  }
  public isPasswordCorrect(uuid: string, password: string): boolean {
    return this.lobbyMap.get(uuid)?.password === password;
  }

  public joinLobby(client: Socket, uuid: string, password?: string): false | Lobby {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = client.data;
    if (lobby && username && (!lobby.password || lobby.password === password)) {
      const score = 0;
      const player = new Player({ username, score });
      lobby.players[player.username] = player;
      this.roomsService.joinRoom(client, lobby.uuid);
      this.logger.log(`Join: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
      return lobby;
    }
    this.logger.log(`Join failed: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
    return false;
  }

  public leaveLobby(client: Socket, uuid: string): false | string {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = client.data;
    if (lobby && username) {
      this.roomsService.leaveRoom(client, uuid);
      this.logger.log(`Leave: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
      return uuid;
    }
    this.logger.log(`Leave failed: ${username} -> ${lobby.lobbyName}(${lobby.uuid})`);
    return false;
  }

  public destroyLobby(server: Server, uuid: string): false | string {
    const res = this.lobbyMap.delete(uuid);
    if (res) {
      this.roomsService.deleteRoom(server, uuid);
      this.logger.log(`Destroy: ${uuid}`);
      return uuid;
    }
    this.logger.log(`Destroy failed: ${uuid}`);
    return false;
  }

  public getLobbyData(uuid: string): false | Lobby {
    const lobby = this.lobbyMap.get(uuid);
    return lobby ?? false;
  }

  public getLobbyList(options: LobbyListOptions): [string, Lobby][] {
    this.logger.log(`GetLobbyList: ${JSON.stringify(options)}`);

    const list = [...this.lobbyMap.entries()];

    const filteredList = list.filter(
      ([_, lobby]) =>
        ('isPrivate' in options ? Boolean(lobby.password) === options.isPrivate : true) &&
        ('nameContains' in options ? lobby.lobbyName.includes(options.nameContains) : true),
    );

    return 'chunk' in options ? getChunk(options.chunk.page, options.chunk.limit, filteredList) : filteredList;
  }
}
