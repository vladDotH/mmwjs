import { RouterContext } from 'koa-router';
import { fromPairs, invert, isArray, keys, zipObject } from 'lodash';
import { RMiddleware } from './route';

// export function useKoaContextObj<const K extends keyof RouterContext>(
//   key: K,
// ): RMiddleware<
//   any,
//   {
//     [key in K]: RouterContext[K];
//   }
// >;
//
// export function useKoaContextObj<
//   const K extends keyof RouterContext,
//   const N extends string,
// >(
//   key: K,
//   name: N,
// ): RMiddleware<
//   any,
//   {
//     [key in N]: RouterContext[K];
//   }
// >;

export function useKoaContextObj<
  const K extends keyof RouterContext,
  const N,
  R = RouterContext[K],
>(key: K, name?: N) {
  const kName = name ?? key;
  return <T>(ctx: T, kctx: RouterContext) => {
    return {
      [`${kName}`]: kctx[key],
    } as N extends string
      ? { [key in N]: RouterContext[K] }
      : { [key in K]: R };
  };
}

export function useReq<const K>(name?: K) {
  return useKoaContextObj('req', name);
}

export function useRes<const K>(name?: K) {
  return useKoaContextObj('res', name);
}

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
