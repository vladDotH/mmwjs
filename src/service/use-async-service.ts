import { AsyncService } from './async-service.interface';

export function useAsyncService<T>(srv: AsyncService<T>): T {
  return new Proxy(srv, {
    get(target: AsyncService<T>, p: string | symbol): any {
      return target._get(p as keyof T);
    },
    set(target: AsyncService<T>, p: string | symbol, newValue: any): boolean {
      return target._set(p as keyof T, newValue);
    },
  }) as T;
}
