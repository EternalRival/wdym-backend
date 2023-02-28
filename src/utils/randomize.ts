export function randomize(min: number, max: number, isInclusive?: boolean): number {
  return Math.floor(Math.random() * (max - min + +(isInclusive ?? false))) + min;
}

export function getRandomArrayItem<T>(array: T[]): T {
  return array[randomize(0, array.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
