import { IPlayer, PlayerMeme } from '../interfaces/player.interface';

export class Player implements IPlayer {
  constructor(public readonly username: string, public readonly image: string) {}
  public score: number = 0;
  public meme: PlayerMeme = null;
  public vote: PlayerMeme = null;

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
