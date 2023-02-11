import { CreatePlayerDto } from '../dto/create-player.dto';

export class Player implements CreatePlayerDto {
  public readonly username: string;
  public score: number = 0;

  constructor(createPlayerDto: CreatePlayerDto) {
    Object.assign(this, createPlayerDto);
  }
}
