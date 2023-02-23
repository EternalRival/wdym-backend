import { GamePhase } from '../enum/game-phase.enum';
import { PlayerDto } from './player.dto';
import { CreateLobbyDto } from './create-lobby.dto';

export class LobbyDto extends CreateLobbyDto {
  public readonly uuid!: string;
  public readonly players!: Record<string, PlayerDto>;
  public phase!: GamePhase;
  public rounds!: string[];
}
