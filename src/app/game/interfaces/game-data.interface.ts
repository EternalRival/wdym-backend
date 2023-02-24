import { GamePhase } from '../enums/game-phase.enum';
import { Player, Situation } from '../classes/player';
import { GameMode } from '../enums/game-mode.enum';

export type Choice = keyof Pick<Player, 'situation' | 'meme' | 'vote'>;
export type ChoiceList = Record<NonNullable<Player[Choice]>, Player['username'][]>;

export interface IGameData {
  mode: GameMode;
  phase: GamePhase;
  players: Player[];
  situations: NonNullable<Situation>[]; // TODO
  situation: Situation;
  memes: ChoiceList;
  votes: ChoiceList;
  currentRound: number;
  changePhaseDate: number | null;
}
