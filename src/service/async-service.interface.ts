export interface AsyncService<T> {
  setup: Promise<T>;
  instance: T | null;
}
