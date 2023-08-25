import { AsyncService } from './async-service.interface';
import { AsyncServiceError } from './async-service.error';

export function createAsyncService<T>(fn: () => Promise<T>): AsyncService<T> {
  const srv: AsyncService<T> = {
    setup: fn(),
    instance: null,
    _get() {
      throw new AsyncServiceError('Uninitialized async service');
    },
    _set() {
      throw new AsyncServiceError('Uninitialized async service');
    },
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
