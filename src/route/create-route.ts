import { Rewrite, RType } from '../core';
import { RMiddleware, Route, RRegFn } from './index';

export function createRoute(method: RType, path: string, regFn: RRegFn): Route {
  return {
    method,
    path,
    middlewares: [],
    regFn,

    use<T, V>(fn: RMiddleware<T, V>): Route<Rewrite<T, V>> {
      this.middlewares.push(fn);
      return this;
    },

    go(this: Route, fn: (ctx: any) => any) {
      this.middlewares.push(fn);
      this.regFn(this);
    },
  };
}
