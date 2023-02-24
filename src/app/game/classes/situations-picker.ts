import { Situation } from './player';

export class SituationsPicker {
  private list: Situation[] = [];

  public clear(): void {
    this.list.length = 0;
  }

  public get current(): Situation {
    return this.list.at(-1) ?? null;
  }
}
