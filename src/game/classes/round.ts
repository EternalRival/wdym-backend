import { PlayerVote } from '../interfaces/player.interface';
import { IRound } from '../interfaces/round.interface';

export class Round implements IRound {
  public winner: PlayerVote = null;
  constructor(public readonly situation: string) {}

  public setWinner(vote: PlayerVote): void {
    this.winner = vote;
  }
}
