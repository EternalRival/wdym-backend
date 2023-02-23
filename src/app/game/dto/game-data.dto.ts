import { PickType } from '@nestjs/mapped-types';
import { MemeList } from './player.dto';
import { LobbyDto } from './lobby.dto';

/** Для отрисовки игры */
export class GameDataDto extends PickType(LobbyDto, ['players', 'status', 'rounds', 'mode']) {
  public currentRound!: number;
  public memes!: MemeList; // {'meme1':['oleg','petr'],'meme2':['vasya']}
  public votes!: MemeList;

  public changeStatusDate!: number | null;
}
