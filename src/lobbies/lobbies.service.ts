import { Injectable } from '@nestjs/common';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { UpdateLobbyDto } from './dto/update-lobby.dto';

@Injectable()
export class LobbiesService {
  public create(createLobbyDto: CreateLobbyDto): string {
    return 'This action adds a new lobby';
  }

  public findAll(): string {
    return `This action returns all lobbies`;
  }

  public findOne(id: number): string {
    return `This action returns a #${id} lobby`;
  }

  public update(id: number, updateLobbyDto: UpdateLobbyDto): string {
    return `This action updates a #${id} lobby`;
  }

  public remove(id: number): string {
    return `This action removes a #${id} lobby`;
  }
}
