import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoInput } from '../io/enums/event-name.enum';
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

  @SubscribeMessage(IoInput.createLobbyRequest)
  private handleCreateLobbyRequest(@MessageBody('lobby') lobby: CreateLobbyDto): Lobby {
    return this.lobbiesService.createLobby(this.io, lobby);
  }

  @SubscribeMessage(IoInput.isLobbyNameUniqueRequest)
  private handleIsLobbyNameUniqueRequest(@MessageBody('lobbyName') lobbyName: string): boolean {
    return this.lobbiesService.isLobbyNameUnique(lobbyName);
  }

  @SubscribeMessage(IoInput.isPasswordCorrectRequest)
  private handleIsPasswordCorrectRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
  ): boolean {
    return this.lobbiesService.isPasswordCorrect(uuid, password);
  }

  @SubscribeMessage(IoInput.joinLobbyRequest)
  private handleJoinLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() socket: Socket,
  ): Lobby {
    return this.lobbiesService.joinLobby(this.io, socket, uuid, password);
  }

  @SubscribeMessage(IoInput.leaveLobbyRequest)
  private handleLeaveLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @ConnectedSocket() socket: Socket,
  ): string {
    return this.lobbiesService.leaveLobby(this.io, socket, uuid);
  }

  @SubscribeMessage(IoInput.destroyLobbyRequest)
  private handleDestroyLobbyRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): string {
    return this.lobbiesService.destroyLobby(this.io, uuid);
  }

  @SubscribeMessage(IoInput.lobbyDataRequest)
  private handleGetLobbyDataRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): Lobby {
    return this.lobbiesService.getLobbyData(uuid);
  }

  @SubscribeMessage(IoInput.lobbyListRequest)
  private handleGetLobbyList(@MessageBody() options: ILobbyListOptions): [string, Lobby][] {
    return this.lobbiesService.getLobbyList(options);
  }
}
