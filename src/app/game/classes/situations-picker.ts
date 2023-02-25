import { shuffleArray } from 'src/utils/randomize';
import { Situation } from './player';

export class SituationsPicker {
  private played: Situation[] = [];

  public options: Situation[] = [];

  public clear(list: 'played' | 'options'): void {
    this[list].length = 0;
  }

  public get current(): Situation {
    return this.played.at(-1) ?? null;
  }

  public setOptions(list: Situation[]): void {
    this.options = shuffleArray(list.filter((situation) => !this.played.includes(situation))).slice(-2);
  }

  public setPlayed(situation?: Situation): void {
    this.played.push(situation ?? this.options[Math.round(Math.random())]);
  }
}
