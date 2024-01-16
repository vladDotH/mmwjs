import { chain, every, isFunction } from 'lodash';
import { AsyncService } from './async-service.interface';

type NotFn<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? unknown : T[K];
};

type AsyncifyFn<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K];
};

type AsyncifyObject<T> = NotFn<T> & AsyncifyFn<T>;

export function asyncifyService<K extends string, V, S = Record<K, V>>(
  service: S,
  ...awaits: AsyncService<any>[]
): AsyncifyObject<S> {
  let fulfilled = every(awaits, (s) => s.status === 'fulfilled');
  let promise = null;

  if (!fulfilled) {
    promise = Promise.all(awaits.map((s) => s.setup)).then(
      () => (fulfilled = true),
    );
  }

  return {
    ...service,
    ...chain(service)
      .toPairs()
      .filter(([key, val]) => isFunction(val))
      .map(([key, fn]: [string, CallableFunction]) => [
        key,
        async (...args: any[]) => {
          if (!fulfilled) await promise;
          return fn(...args);
        },
      ])
      .fromPairs()
      .value(),
  };
}
