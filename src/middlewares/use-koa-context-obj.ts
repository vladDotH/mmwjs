import { RouterContext } from 'koa-router';
import { MWContext } from '../route';

export function useKoaContextObj<
  const K extends keyof RouterContext,
  const N,
  R = RouterContext[K],
>(key: K, name?: N) {
  const kName = name ?? key;
  return <T>(state: T, ctx: MWContext) => {
    return {
      [`${kName}`]: ctx[key],
    } as N extends string ? { [key in N]: MWContext[K] } : { [key in K]: R };
  };
}
