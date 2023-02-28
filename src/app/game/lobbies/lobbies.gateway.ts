import { ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoInput } from '../../io/enums/event-name.enum';
import { GameLobbiesService } from './lobbies.service';
import { IoGateway } from '../../io/io.gateway';
import { IoWsGateway } from '../../io/io.decorator';
import { LobbyListOptionsDto } from '../dto/lobby-list-options.dto';
import { CreateLobbyDto } from '../dto/create-lobby.dto';
import { IGameData } from '../interfaces/game-data.interface';
import { ILobbyData } from '../interfaces/lobby-data.interface';

@IoWsGateway()
export class GameLobbiesGateway extends IoGateway {
  constructor(private readonly lobbiesService: GameLobbiesService) {
    super();
    setInterval(() => this.lobbiesService.clearEmptyLobbies(this.io), 5 * 60 * 1000);
  }

  @SubscribeMessage(IoInput.createLobby)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  private handleCreateLobbyRequest(@MessageBody('lobby') createLobbyDto: CreateLobbyDto): ILobbyData {
    return this.lobbiesService.createLobby(this.io, createLobbyDto);
  }

  @SubscribeMessage(IoInput.joinLobby)
  private handleJoinLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() socket: Socket,
  ): IGameData {
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

  @SubscribeMessage(IoInput.lobbyList)
  private handleGetLobbyList(@MessageBody() options: LobbyListOptionsDto): ILobbyData[] {
    return this.lobbiesService.getLobbyList(options);
  }
}
