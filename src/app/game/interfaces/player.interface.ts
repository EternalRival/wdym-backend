export type PlayerMeme = null | string;
// export type PlayerMeme = null | Pick<IPlayer, 'username' | 'meme'>;

export interface IPlayer {
  image: string;
  username: string;
  score: number;
  meme: PlayerMeme;
  vote: PlayerMeme;
}

export type PlayerBasicInfo = Pick<IPlayer, 'username' | 'image'>;
