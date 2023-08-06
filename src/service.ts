export type AsyncService<T> = {
  setup: Promise<T>;
  instance: T | null;
};

export function createAsyncService<T>(fn: () => Promise<T>): AsyncService<T> {
  const srv = { setup: fn(), instance: null };
  srv.setup.then((value) => (srv.instance = value));
  return srv;
}

class AsyncServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AsyncServiceError';
  }
}

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
