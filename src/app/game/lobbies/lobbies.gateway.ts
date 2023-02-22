import { ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IoInput } from '../../io/enums/event-name.enum';
import { GameLobbiesService } from './lobbies.service';
import { IoGateway } from '../../io/io.gateway';
import { IoWsGateway } from '../../io/io.decorator';
import { GameDataDto } from '../dto/game-data.dto';
import { LobbyDataDto } from '../dto/lobby-data.dto';
import { LobbyListOptionsDto } from '../dto/lobby-list-options.dto';
import { CreateLobbyDto } from '../dto/create-lobby.dto';

@IoWsGateway()
@UsePipes(new ValidationPipe({ transform: true }))
export class GameLobbiesGateway extends IoGateway {
  constructor(private readonly lobbiesService: GameLobbiesService) {
    super();
  }

  @SubscribeMessage(IoInput.createLobby)
  private handleCreateLobbyRequest(@MessageBody('lobby') createLobbyDto: CreateLobbyDto): LobbyDataDto {
    console.log(createLobbyDto);
    return this.lobbiesService.createLobby(this.io, createLobbyDto);
  }

  @SubscribeMessage(IoInput.joinLobby)
  private handleJoinLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() socket: Socket,
  ): GameDataDto {
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
  private handleGetLobbyList(@MessageBody() options: LobbyListOptionsDto): LobbyDataDto[] {
    return this.lobbiesService.getLobbyList(options);
  }
}
