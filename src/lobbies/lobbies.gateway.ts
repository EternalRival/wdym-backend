import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../socket-io/enums/event-name.enum';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './entities/lobby.entity';
import { LobbiesService } from './lobbies.service';
import { ILobbyListOptions } from './interfaces/lobby-list-options.interface';

@WebSocketGateway({ cors: { origin: true } })
export class LobbiesGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly lobbiesService: LobbiesService) {}

  @SubscribeMessage(EventName.createLobbyRequest)
  private handleCreateLobbyRequest(@MessageBody('lobby') lobby: CreateLobbyDto): Lobby {
    console.log('handleCreateLobbyRequest', JSON.stringify({ lobby }));
    return this.lobbiesService.createLobby(this.server, lobby);
  }

  // ? возможно поменять на нейм а скорее всгео точнго
  /* @SubscribeMessage(EventName.isUuidUniqueRequest)
  private handleIsUuidUniqueRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): boolean {
    console.log('handleIsUuidUniqueRequest', { uuid });
    return this.lobbiesService.isUuidUnique(uuid);
  } */
  @SubscribeMessage(EventName.isPasswordCorrectRequest)
  private handleIsPasswordCorrectRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
  ): boolean {
    return this.lobbiesService.isPasswordCorrect(uuid, password);
  }

  @SubscribeMessage(EventName.joinLobbyRequest)
  private handleJoinLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: Socket,
  ): false | Lobby {
    console.log('handleJoinLobbyRequest', { uuid, password });
    return this.lobbiesService.joinLobby(client, uuid, password);
  }

  @SubscribeMessage(EventName.destroyLobbyRequest)
  private handleDestroyLobbyRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): string | false {
    console.log('handleDestroyLobbyRequest', { uuid });
    return this.lobbiesService.destroyLobby(this.server, uuid);
  }

  @SubscribeMessage(EventName.getLobbyData)
  private handleGetLobbyDataRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): false | Lobby {
    console.log('handleGetLobbyDataRequest', { uuid });
    return this.lobbiesService.getLobbyData(uuid);
  }

  @SubscribeMessage(EventName.getLobbyList)
  private handleGetLobbyList(@MessageBody() options: ILobbyListOptions): [string, Lobby][] {
    console.log('handleGetLobbyList', options);
    return this.lobbiesService.getLobbyList(options);
  }
}
