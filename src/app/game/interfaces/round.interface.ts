import { PlayerVote } from "./player.interface";

export interface IRound {
  situation: string;
  winner: PlayerVote;
}
