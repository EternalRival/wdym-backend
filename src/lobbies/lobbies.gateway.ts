import { ParseUUIDPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventName } from '../socket-io/enums/event-name.enum';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './entities/lobby.entity';
import { LobbiesService } from './lobbies.service';

@WebSocketGateway({ cors: { origin: true } })
export class LobbiesGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly lobbiesService: LobbiesService) {}

  @SubscribeMessage(EventName.createLobbyRequest)
  public handleCreateLobbyRequest(@MessageBody('lobby') lobby: CreateLobbyDto): Lobby {
    return this.lobbiesService.createLobby(lobby);
  }

  @SubscribeMessage(EventName.isUuidUniqueRequest)
  public handleIsUuidUniqueRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): boolean {
    return this.lobbiesService.isUuidUnique(uuid);
  }

  @SubscribeMessage(EventName.joinLobbyRequest)
  public handleJoinLobbyRequest(
    @MessageBody('uuid', ParseUUIDPipe) uuid: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: Socket,
  ): false | Lobby {
    return this.lobbiesService.joinLobby(client, uuid, password);
  }

  @SubscribeMessage(EventName.destroyLobbyRequest)
  public handleDestroyLobbyRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): string | false {
    return this.lobbiesService.destroyLobby(this.server, uuid);
  }

  @SubscribeMessage(EventName.getLobbyData)
  public handleGetLobbyDataRequest(@MessageBody('uuid', ParseUUIDPipe) uuid: string): false | Lobby {
    return this.lobbiesService.getLobbyData(uuid);
  }
}
