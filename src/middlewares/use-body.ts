import { RMiddleware } from '../route';
import { identity } from 'lodash';
import { Pipe } from '../pipe';

// TODO swagger annotation

export function useAsyncBody<C = any>(
  pipe?: Pipe<any, Promise<C>>,
): RMiddleware<any, { body: Promise<C> }> {
  const fn = pipe ?? identity;
  return (ctx, kctx) => ({ body: fn(kctx.body) });
}

export function useBody<C = any>(
  pipe?: Pipe<any, C>,
): RMiddleware<any, { body: Awaited<C> }> {
  const fn = pipe ?? identity;
  return async (ctx, kctx) => ({ body: await fn(kctx.body) });
}
