import { AsyncService } from './async-service.interface';
import { AsyncServiceError } from './async-service.error';

function baseSrvGetSet(): never {
  throw new AsyncServiceError('Uninitialized async service');
}

export function createAsyncService<T>(fn: () => Promise<T>): AsyncService<T> {
  const srv: AsyncService<T> = {
    setup: fn(),
    instance: null,
    _get: baseSrvGetSet,
    _set: baseSrvGetSet,
  };

  srv.setup.then((value) => {
    srv.instance = value;
    srv._get = (key) => srv.instance[key];
    srv._set = (key, value) => {
      srv.instance[key] = value;
      return true;
    };
  });

  return srv;
}
