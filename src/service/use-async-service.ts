import { AsyncService } from './async-service.interface';
import { AsyncServiceError } from './async-service.error';

export function useAsyncService<T>(srv: AsyncService<T>): T {
  return new Proxy(srv, {
    get(target: AsyncService<T>, p: string | symbol): any {
      if (target.instance === null)
        throw new AsyncServiceError('Uninitialized async service');
      return target.instance[p];
    },
    set(target: AsyncService<T>, p: string | symbol, newValue: any): boolean {
      if (target.instance === null)
        throw new AsyncServiceError('Uninitialized async service');
      target.instance[p] = newValue;
      return true;
    },
  }) as T;
}
