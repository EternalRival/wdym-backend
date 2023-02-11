import { IPlayer } from '../interfaces/player.interface';

export class CreatePlayerDto implements IPlayer {
  public readonly username: string;
  public score: number;
}
