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

//  TODO перепроверить ВСЁ в этом файле!! (и переписать)
//* TODO перепроверить ВСЁ в этом файле!! (и переписать)
//! TODO перепроверить ВСЁ в этом файле!! (и переписать)
//? TODO перепроверить ВСЁ в этом файле!! (и переписать)

@Injectable()
export class LobbiesService {
  public logger = new Logger('Lobbies');
  private lobbyMap: Map<string, Lobby> = new Map(); // Map<Lobby['uuid'], Lobby>

  constructor(private roomsService: RoomsService) {}

  public createLobby(io: Server, createLobbyData: ICreateLobbyData): ILobbyData {
    const uuid = this.generateUniqueUuid();
    const lobby = new Lobby(createLobbyData, uuid);
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

  public joinLobby(io: Server, socket: Socket, uuid: string, password?: string): Lobby {
    const lobby = this.lobbyMap.get(uuid);
    const { username, image } = socket.data;
    if (
      lobby instanceof Lobby &&
      username &&
      (lobby.privacyType === LobbyPrivacyType.PUBLIC || lobby.password === password)
    ) {
      if (!lobby.hasPlayer(username)) {
        const player = new Player(username, image);
        lobby.players[username] = player;
        io.to(uuid).emit(IoOutput.joinLobby, lobby.players);
        this.logger.log(`Join: ${username} -> ${lobby.title}(${uuid})`);
      }
      this.roomsService.joinRoom(io, socket, lobby.uuid);
      return lobby;
    }
    throw new WsException(`Join failed: ${username} -> ${lobby?.title}(${uuid})`);
  }

  public leaveLobby(io: Server, socket: Socket, uuid: string): string {
    const lobby = this.lobbyMap.get(uuid);
    const { username } = socket.data;

    if (lobby instanceof Lobby && username && lobby.hasPlayer(username)) {
      this.roomsService.leaveRoom(socket, uuid);
      io.to(uuid).emit(IoOutput.leaveLobby, lobby.players);
      this.logger.log(`Leave: ${username} -> ${lobby.title}(${uuid})`);
      if (lobby.isEmpty) {
        // TODO реализовать отменяемое удаление с задержкой
        this.destroyLobby(io, uuid);
      }
      return uuid;
    }
    throw new WsException(`Leave failed: ${username} -> ${lobby?.title}(${uuid})`);
  }

  public destroyLobby(io: Server, uuid: string): string {
    const deleteResult: boolean = this.lobbyMap.delete(uuid);
    if (deleteResult) {
      this.roomsService.deleteRoom(io, uuid);
      this.logger.log(`Destroy: ${uuid}`);
      return uuid;
    }
    throw new WsException(`Destroy failed: ${uuid}`);
  }

  public getLobbyData(uuid: string): Lobby {
    const lobby = this.lobbyMap.get(uuid);
    if (lobby instanceof Lobby) {
      return lobby;
    }
    throw new WsException(`No lobby with uuid ${uuid}`);
  }

  public getLobbyList(options: ILobbyListOptions): [string, ILobbyData][] {
    this.logger.log(`GetLobbyList: ${JSON.stringify(options)}`);

    const list: [string, Lobby][] = [...this.lobbyMap.entries()].filter(([_, lobby]) => {
      const privacy: boolean =
        'privacy' in options && options.privacy !== LobbyPrivacyType.ALL ? options.privacy === lobby.privacyType : true;
      const nameContains: boolean =
        'nameContains' in options && options.nameContains ? lobby.title.includes(options.nameContains) : true;

      return !lobby.isStarted && privacy && nameContains;
    });

    const chunk: [string, Lobby][] =
      'chunk' in options && options.chunk ? getChunk(options.chunk.page, options.chunk.limit, list) : list;

    return chunk.map(([uuid, lobby]): [string, ILobbyData] => [uuid, lobby.lobbyData]);
  }
}
