import { RMiddleware } from '../route';
import { fromPairs, invert, isArray, keys, zipObject } from 'lodash';
import { RouterContext } from 'koa-router';

export function useParams<const K extends string>(
  params: K[],
): RMiddleware<any, Record<K, string>>;

export function useParams<K extends string, V extends string>(
  params: Record<K, V>,
): RMiddleware<any, Record<K, string>>;

export function useParams(params: Record<string, string> | string[]) {
  const invParams = isArray(params)
    ? zipObject(params, params)
    : invert(params);
  return (ctx: any, kctx: RouterContext) => {
    return fromPairs(
      keys(invParams).map((key) => [invParams[key], kctx.params[key]]),
    );
  };
}
