import { IPlayer, PlayerVote } from '../interfaces/player.interface';

export class Player implements IPlayer {
  constructor(public readonly username: string, public readonly image: string) {}
  public score: number = 0;
  public meme: string | null = null;
  public vote: PlayerVote | null = null;

  public setMeme(meme: this['meme']): void {
    this.meme = meme;
  }
  public setVote(vote: this['vote']): void {
    this.vote = vote;
  }
  public setScore(score: this['score']): void {
    this.score = score;
  }
}
