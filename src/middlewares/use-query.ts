import { RMiddleware } from '../route';
import { createPipe, PipeOrFn } from '../pipe';
import { identity, isFunction, isString } from 'lodash';
import { RouterContext } from 'koa-router';

export function useQuery<const K extends string>(
  key: K,
): RMiddleware<any, Record<K, string | string[]>>;

export function useQuery<const K extends string, T = string>(
  key: K,
  pipe: PipeOrFn<string | string[], T>,
): RMiddleware<any, Record<K, Awaited<T>>>;

export function useQuery<const K extends string>(
  key: K,
  paramKey: string,
): RMiddleware<any, Record<K, string | string[]>>;

export function useQuery<const K extends string, T = string>(
  key: K,
  paramKey: string,
  pipe: PipeOrFn<string | string[], T>,
): RMiddleware<any, Record<K, Awaited<T>>>;

export function useQuery(
  key: string,
  paramOrPipe?: string | PipeOrFn<string | string[], any>,
  pipe?: PipeOrFn<string | string[], any>,
) {
  const paramKey = isString(paramOrPipe) ? paramOrPipe : key;
  const transform = createPipe(
    pipe ?? (isFunction(paramOrPipe) ? paramOrPipe : identity),
  );
  return async (ctx: any, kctx: RouterContext) => {
    return { [key]: await transform(kctx.query[paramKey]) };
  };
}
