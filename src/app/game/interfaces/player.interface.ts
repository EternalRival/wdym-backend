export type PlayerMeme = null | string;
export type PlayerVote = null | Pick<IPlayer, 'username' | 'meme'>;

export interface IPlayer {
  image: string;
  username: string;
  score: number;
  meme: PlayerMeme;
  vote: PlayerVote;
}
