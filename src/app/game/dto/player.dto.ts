export type Meme = null | string;
export type MemeList = Record<NonNullable<Meme>, PlayerDto['username'][]>;

export class PlayerDto {
  public image!: string;
  public username!: string;
  public score!: number;
  public meme!: Meme;
  public vote!: Meme;
}
