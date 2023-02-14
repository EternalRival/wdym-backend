import { IPlayer } from '../interfaces/player.interface';

export class Player implements IPlayer {
  constructor(public readonly username: string, public readonly image: string) {}
  public score: number = 0;
  public meme!: string;
}
