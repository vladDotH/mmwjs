import { RMiddleware } from '../route';
import { AsyncService } from '../service';

export function awaitService<S, T>(srv: AsyncService<S>): RMiddleware<T, T> {
  return async (ctx) => {
    if (srv.status === 'pending') await srv.setup;
    return ctx;
  };
}
