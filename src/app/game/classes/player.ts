import { CreatePlayerDto } from '../dto/create-player.dto';

export type Meme = null | string;
export type Vote = null | string;
export type Situation = null | string;

export class Player {
  public username: string;
  public image: string;
  public score: number = 0;
  public meme: Meme = null;
  public vote: Vote = null;
  public situation: Situation = null;

  constructor(createPlayerData: CreatePlayerDto) {
    this.username = createPlayerData.username;
    this.image = createPlayerData.image;
  }

  public setScore(score: this['score']): void {
    this.score = score;
  }
  public setMeme(meme: this['meme']): void {
    this.meme = meme;
  }
  public setVote(vote: this['vote']): void {
    this.vote = vote;
  }
  public setSituation(situation: this['situation']): void {
    this.situation = situation;
  }
}
