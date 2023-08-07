import { AsyncService } from './async-service.interface';

export function createAsyncService<T>(fn: () => Promise<T>): AsyncService<T> {
  const srv = { setup: fn(), instance: null };
  srv.setup.then((value) => (srv.instance = value));
  return srv;
}
