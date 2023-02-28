export class DelayedFunction {
  private timer?: NodeJS.Timer;
  public triggerDate: null | number = null;

  public set(callback: () => void, delay: number): void {
    this.cancel();
    this.triggerDate = Date.now() + delay;
    this.timer = setTimeout(callback, delay);
  }

  public cancel(): void {
    clearTimeout(this.timer);
    this.triggerDate = null;
  }
}
