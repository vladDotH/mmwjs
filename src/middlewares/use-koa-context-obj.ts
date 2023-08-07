import { RouterContext } from 'koa-router';

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
