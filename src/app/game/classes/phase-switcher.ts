import { GamePhase } from '../enums/game-phase.enum';

export class PhaseSwitcher {
  public current = GamePhase.PREPARE;

  public set(phase: GamePhase): this {
    this.current = phase;
    return this;
  }

  public next(): this {
    const phases = Object.values(GamePhase);
    const currentIndex = phases.indexOf(this.current);
    const nextPhase = phases[(currentIndex + 1) % phases.length];
    this.set(nextPhase);
    return this;
  }
}
