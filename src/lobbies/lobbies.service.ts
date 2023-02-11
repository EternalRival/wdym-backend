import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './entities/lobby.entity';
import { Player } from './entities/player.entity';

@Injectable()
export class LobbiesService {
  private lobbyMap: Map<Lobby['uuid'], Lobby> = new Map();

  constructor(private roomsService: RoomsService) {}

  public createLobby(createLobbyDto: CreateLobbyDto): Lobby {
    const uuid = this.generateUniqueUuid();
    const lobby = new Lobby(createLobbyDto, uuid);
    this.lobbyMap.set(lobby.uuid, lobby);
    return lobby;
  }

  private generateUniqueUuid(): string {
    const uuid = randomUUID();
    return this.isUuidUnique(uuid) ? uuid : this.generateUniqueUuid();
  }

  public isUuidUnique(uuid: string): boolean {
    return !this.lobbyMap.has(uuid);
  }
  // TODO
  /* public isPasswordCorrect(uuid: string, password: string): boolean {
    return this.lobbyMap.get(uuid)?.password === password;
  } */

  public joinLobby(client: Socket, uuid: string, password?: string): false | Lobby {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = client.data;
    if (lobby && username && (!lobby.password || lobby.password === password)) {
      const score = 0;
      const player = new Player({ username, score });
      Object.assign(lobby.players, player);
      this.roomsService.joinRoom(client, uuid);
      return lobby;
    }
    return false;
  }

  public leaveLobby(client: Socket, uuid: string): false | string {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = client.data;
    if (lobby && username) {
      this.roomsService.leaveRoom(client, uuid);
      return uuid;
    }
    return false;
  }

  public destroyLobby(server: Server, uuid: string): false | string {
    const res = this.lobbyMap.delete(uuid);
    if (res) {
      this.roomsService.deleteRoom(server, uuid);
      return uuid;
    }
    return false;
  }

  public getLobbyData(uuid: string): false | Lobby {
    const lobby = this.lobbyMap.get(uuid);
    return lobby ?? false;
  }
}
