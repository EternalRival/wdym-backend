export interface IPlayer {
  image: string;
  username: string;
  score: number;
  meme: string | null;
  vote: PlayerVote | null;
}

export type PlayerVote = Pick<IPlayer, 'username' | 'meme'>;
