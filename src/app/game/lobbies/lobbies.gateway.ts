import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoInput } from '../../io/enums/event-name.enum';
import { Lobby } from '../classes/lobby';
import { GameLobbiesService } from './lobbies.service';
import { IoGateway } from '../../io/io.gateway';
import { IoWsGateway } from '../../io/io.decorator';
import { ICreateLobbyData, ILobbyData, ILobbyListOptions } from '../interfaces/lobby.interface';

@IoWsGateway()
export class GameLobbiesGateway extends IoGateway {
  constructor(private readonly lobbiesService: GameLobbiesService) {
    super();
  }

  @SubscribeMessage(IoInput.createLobby)
  private handleCreateLobbyRequest(@MessageBody('lobby') createLobbyData: ICreateLobbyData): ILobbyData {
    return this.lobbiesService.createLobby(this.io, createLobbyData);
  }

  @SubscribeMessage(IoInput.joinLobby)
  private handleJoinLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() socket: Socket,
  ): Lobby {
    // TODO согласовать с Игорем отправляемые данные, чтобы не отправлять лобби целиком
    return this.lobbiesService.joinLobby(this.io, socket, uuid, password);
  }

  @SubscribeMessage(IoInput.leaveLobby)
  private handleLeaveLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.lobbiesService.leaveLobby(this.io, socket, uuid);
  }

  @SubscribeMessage(IoInput.destroyLobby)
  private handleDestroyLobbyRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): string {
    return this.lobbiesService.destroyLobby(this.io, uuid);
  }

  @SubscribeMessage(IoInput.lobbyData)
  private handleGetLobbyDataRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): Lobby {
    // TODO согласовать с Игорем отправляемые данные, чтобы не отправлять лобби целиком
    return this.lobbiesService.getLobbyData(uuid);
  }

  @SubscribeMessage(IoInput.lobbyList)
  private handleGetLobbyList(@MessageBody() options: ILobbyListOptions): ILobbyData[] {
    return this.lobbiesService.getLobbyList(options);
  }
}
