import { PickType } from '@nestjs/mapped-types';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { PlayerDto } from './player.dto';
import { LobbyDto } from './lobby.dto';

/** Для отрисовки списка лобби */
export class LobbyDataDto extends PickType(LobbyDto, [
  'uuid',
  'title',
  'owner',
  'image',
  'mode',
  'maxPlayers',
  'maxRounds',
]) {
  public privacyType!: LobbyPrivacyType;
  public players!: Pick<PlayerDto, 'image' | 'username'>[];
  public playersCount!: number;
  public isFull!: boolean;
}
