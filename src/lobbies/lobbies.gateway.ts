import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../socket-io/enums/event-name.enum';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './entities/lobby.entity';
import { LobbiesService } from './lobbies.service';
import { LobbyListOptions } from './types/lobby-list-options.type';

@WebSocketGateway({ cors: { origin: true } })
export class LobbiesGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly lobbiesService: LobbiesService) {}

  @SubscribeMessage(EventName.createLobbyRequest)
  public handleCreateLobbyRequest(@MessageBody('lobby') lobby: CreateLobbyDto): Lobby {
    console.log('handleCreateLobbyRequest', JSON.stringify({ lobby }));
    return this.lobbiesService.createLobby(this.server, lobby);
  }

  // ? возможно поменять на нейм а скорее всгео точнго
  /* @SubscribeMessage(EventName.isUuidUniqueRequest)
  public handleIsUuidUniqueRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): boolean {
    console.log('handleIsUuidUniqueRequest', { uuid });
    return this.lobbiesService.isUuidUnique(uuid);
  } */
  @SubscribeMessage(EventName.isPasswordCorrectRequest)
  public handleIsPasswordCorrectRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
  ): boolean {
    return this.lobbiesService.isPasswordCorrect(uuid, password);
  }

  @SubscribeMessage(EventName.joinLobbyRequest)
  public handleJoinLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: Socket,
  ): false | Lobby {
    console.log('handleJoinLobbyRequest', { uuid, password });
    return this.lobbiesService.joinLobby(client, uuid, password);
  }

  @SubscribeMessage(EventName.destroyLobbyRequest)
  public handleDestroyLobbyRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): string | false {
    console.log('handleDestroyLobbyRequest', { uuid });
    return this.lobbiesService.destroyLobby(this.server, uuid);
  }

  @SubscribeMessage(EventName.getLobbyData)
  public handleGetLobbyDataRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): false | Lobby {
    console.log('handleGetLobbyDataRequest', { uuid });
    return this.lobbiesService.getLobbyData(uuid);
  }

  @SubscribeMessage(EventName.getLobbyList)
  public handleGetLobbyList(@MessageBody() options: LobbyListOptions): [string, Lobby][] {
    console.log('handleGetLobbyList', options);
    return this.lobbiesService.getLobbyList(options);
  }
}
