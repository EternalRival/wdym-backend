export function getChunk<T>(number: number, length: number, list: T[]): T[] {
  return list.slice(number * length, (number + 1) * length);
}
