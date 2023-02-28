import { GamePhase } from '../enums/game-phase.enum';
import { Player, Situation } from '../classes/player';
import { GameMode } from '../enums/game-mode.enum';

export type Choice = keyof Pick<Player, 'situation' | 'meme' | 'vote'>;
export type ChoiceList<T = Player['username']> = Record<NonNullable<Player[Choice]>, T[]>;

export interface IGameData {
  mode: GameMode;
  phase: GamePhase;
  players: Player[];
  situationOptions: Situation[];
  situation: Situation;
  situations: ChoiceList<Pick<Player, 'username' | 'image'>>;
  memes: ChoiceList<Player['username']>;
  votes: ChoiceList<Player['username']>;
  currentRound: number;
  changePhaseDate: number | null;
}
