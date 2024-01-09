import { AsyncServiceStatus } from './index';

export interface AsyncService<T> {
  setup: Promise<T>;
  instance: T | null;
  status: AsyncServiceStatus;

  _get<K extends keyof T>(key: K): T[K];
  _set<K extends keyof T>(key: K, value: T[K]): boolean;
}
