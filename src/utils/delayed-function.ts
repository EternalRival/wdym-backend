export class DelayedFunction {
  private timer: NodeJS.Timer;
  public triggerDate: number;
  constructor(public callback: () => void, public delay: number) {
    this.triggerDate = Date.now() + delay;
    this.timer = setTimeout(callback, delay);
  }
  public cancel(): void {
    clearTimeout(this.timer);
  }
}
