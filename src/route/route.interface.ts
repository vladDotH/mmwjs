import { Path, Rewrite, RType } from '../core';
import { RMiddleware, RRegFn } from './index';

export interface Route<Ctx = object> {
  method: RType;
  path: Path;
  middlewares: RMiddleware<any, any>[];

  regFn: RRegFn;

  use<V>(fn: RMiddleware<Ctx, V>): Route<Rewrite<Ctx, V>>;
  go(fn: (ctx: Ctx) => any): void;
}
