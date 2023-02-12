import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../io/enums/event-name.enum';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './entities/lobby.entity';
import { LobbiesService } from './lobbies.service';
import { ILobbyListOptions } from './interfaces/lobby-list-options.interface';
import { IoGateway } from '../io/io.gateway';
import { IoWsGateway } from '../io/io.decorator';

@IoWsGateway()
export class LobbiesGateway extends IoGateway {
  constructor(private readonly lobbiesService: LobbiesService) {
    super();
  }

  @SubscribeMessage(EventName.createLobbyRequest)
  private handleCreateLobbyRequest(@MessageBody('lobby') lobby: CreateLobbyDto): Lobby {
    console.log('handleCreateLobbyRequest', JSON.stringify({ lobby }));
    return this.lobbiesService.createLobby(this.io, lobby);
  }

  @SubscribeMessage(EventName.isLobbyNameUniqueRequest)
  private handleIsLobbyNameUniqueRequest(@MessageBody('lobbyName') lobbyName: string): boolean {
    console.log('handleIsLobbyNameUniqueRequest', { lobbyName });
    return this.lobbiesService.isLobbyNameUnique(lobbyName);
  }

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
  ): Lobby {
    console.log('handleJoinLobbyRequest', { uuid, password });
    return this.lobbiesService.joinLobby(this.io, client, uuid, password);
  }

  @SubscribeMessage(EventName.leaveLobbyRequest)
  private handleLeaveLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log('handleLeaveLobbyRequest', { uuid });
    return this.lobbiesService.leaveLobby(this.io, client, uuid);
  }

  @SubscribeMessage(EventName.destroyLobbyRequest)
  private handleDestroyLobbyRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): string {
    console.log('handleDestroyLobbyRequest', { uuid });
    return this.lobbiesService.destroyLobby(this.io, uuid);
  }

  @SubscribeMessage(EventName.getLobbyData)
  private handleGetLobbyDataRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): Lobby {
    console.log('handleGetLobbyDataRequest', { uuid });
    return this.lobbiesService.getLobbyData(uuid);
  }

  @SubscribeMessage(EventName.getLobbyList)
  private handleGetLobbyList(@MessageBody() options: ILobbyListOptions): [string, Lobby][] {
    console.log('handleGetLobbyList', options);
    return this.lobbiesService.getLobbyList(options);
  }
}
