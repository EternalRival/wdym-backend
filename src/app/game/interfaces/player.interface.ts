export type Meme = null | string;
export type MemeList = Record<NonNullable<Meme>, IPlayer['username'][]>;
// export type PlayerMeme = null | Pick<IPlayer, 'username' | 'meme'>;

export interface IPlayer {
  image: string;
  username: string;
  score: number;
  meme: Meme;
  vote: Meme;
}

export type PlayerBasicInfo = Pick<IPlayer, 'username' | 'image'>;
