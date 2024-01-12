import { MWContext, RMiddleware } from '../route';
import { identity, isFunction, isString } from 'lodash';
import { RouterContext } from 'koa-router';
import { createPipe, PipeOrFn } from '../pipe';

export function useParam<const K extends string>(
  key: K,
): RMiddleware<any, Record<K, string>>;

export function useParam<const K extends string, T = string>(
  key: K,
  pipe: PipeOrFn<string, T>,
): RMiddleware<any, Record<K, Awaited<T>>>;

export function useParam<const K extends string>(
  key: K,
  paramKey: string,
): RMiddleware<any, Record<K, string>>;

export function useParam<const K extends string, T = string>(
  key: K,
  paramKey: string,
  pipe: PipeOrFn<string, T>,
): RMiddleware<any, Record<K, Awaited<T>>>;

export function useParam(
  key: string,
  paramOrPipe?: string | PipeOrFn<string, any>,
  pipe?: PipeOrFn<string, any>,
) {
  const paramKey = isString(paramOrPipe) ? paramOrPipe : key;
  const transform = createPipe(
    pipe ?? (isFunction(paramOrPipe) ? paramOrPipe : identity),
  );
  return async (ctx: any, kctx: MWContext) => {
    return { [key]: await transform(kctx.params[paramKey]) };
  };
}
