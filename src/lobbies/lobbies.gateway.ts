import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { LobbiesService } from './lobbies.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { UpdateLobbyDto } from './dto/update-lobby.dto';

@WebSocketGateway()
export class LobbiesGateway {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @SubscribeMessage('createLobby')
  public create(@MessageBody() createLobbyDto: CreateLobbyDto): string {
    return this.lobbiesService.create(createLobbyDto);
  }

  @SubscribeMessage('findAllLobbies')
  public findAll(): string {
    return this.lobbiesService.findAll();
  }

  @SubscribeMessage('findOneLobby')
  public findOne(@MessageBody() id: number): string {
    return this.lobbiesService.findOne(id);
  }

  @SubscribeMessage('updateLobby')
  public update(@MessageBody() updateLobbyDto: UpdateLobbyDto): string {
    return this.lobbiesService.update(updateLobbyDto.id, updateLobbyDto);
  }

  @SubscribeMessage('removeLobby')
  public remove(@MessageBody() id: number): string {
    return this.lobbiesService.remove(id);
  }
}
