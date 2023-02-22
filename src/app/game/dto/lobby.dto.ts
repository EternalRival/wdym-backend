import { GameStatus } from '../enum/game-status.enum';
import { PlayerDto } from './player.dto';
import { CreateLobbyDto } from './create-lobby.dto';

export class LobbyDto extends CreateLobbyDto {
  public readonly uuid!: string;
  public readonly players!: Record<string, PlayerDto>;
  public status!: GameStatus;
  public rounds!: string[];
}
