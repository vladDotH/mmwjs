import { RMiddleware } from '../route';
import { identity } from 'lodash';
import { Pipe } from '../pipe';

// TODO swagger annotation

export function useAsyncBody<C = any>(
  pipe?: Pipe<any, Promise<C>>,
): RMiddleware<any, { body: Promise<C> }> {
  const fn = pipe ?? identity;
  return (state, ctx) => ({ body: fn(ctx.body) });
}

export function useBody<C = any>(
  pipe?: Pipe<any, C>,
): RMiddleware<any, { body: Awaited<C> }> {
  const fn = pipe ?? identity;
  return async (state, ctx) => ({ body: await fn(ctx.body) });
}
