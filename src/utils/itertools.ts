export function iteratorOf<T>(value: T): IteratorObject<T, void, unknown> {
  return [value].values();
}

export function concat<T>(...iters: Iterable<T>[]): IteratorObject<T> {
  return iters.values().flatMap((x) => x);
}
