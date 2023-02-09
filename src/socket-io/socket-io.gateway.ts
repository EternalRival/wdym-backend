import { Body, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventName } from './enums/event-name.enum';
import { IWsResponse } from './interfaces/ws-response.interface';
import { SocketIoService } from './socket-io.service';

@WebSocketGateway({ cors: { origin: true } })
@UseGuards(JwtAuthGuard)
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly socketIoService: SocketIoService) {}

  public afterInit(server: Server): IWsResponse {
    const event = EventName.gatewayInit;
    const data = this.socketIoService.afterInit(server);
    return { event, data };
  }
  public handleConnection(@ConnectedSocket() client: Socket, ...args: unknown[]): IWsResponse {
    // console.log('client > ', client);
    const event = EventName.gatewayConnection;
    const data = this.socketIoService.handleConnection(client, args);
    return { event, data };
  }
  public handleDisconnect(@ConnectedSocket() client: Socket): IWsResponse {
    const event = EventName.gatewayDisconnect;
    const data = this.socketIoService.handleDisconnect(client);
    return { event, data };
  }

  @SubscribeMessage(EventName.joinRoom)
  public handleJoinRoom(@MessageBody() data: unknown): void {}
}
