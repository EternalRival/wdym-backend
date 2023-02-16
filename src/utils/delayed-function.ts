export class DelayedFunction {
  private timer?: NodeJS.Timer;
  public triggerDate: null | number = null;

  constructor(public delay: number) {}

  public set(callback: () => void): void {
    this.cancel();
    this.triggerDate = Date.now() + this.delay;
    this.timer = setTimeout(callback, this.delay);
  }

  public cancel(): void {
    clearTimeout(this.timer);
    this.triggerDate = null;
  }
}
