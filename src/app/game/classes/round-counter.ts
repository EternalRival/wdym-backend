export class RoundCounter {
  private counter: number = 0;

  public get current(): number {
    return this.counter;
  }

  public update(option?: { reset: boolean }): void {
    if (option?.reset) {
      this.counter = 0;
    } else {
      this.counter += 1;
    }
  }
}
