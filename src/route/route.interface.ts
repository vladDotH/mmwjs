import { Rewrite, RType } from '../core';
import Router from 'koa-router';
import { RMiddleware } from './index';

export interface Route<Ctx = object> {
  method: RType;
  path: string;
  router: Router;
  middlewares: RMiddleware<any, any>[];

  use<V>(fn: RMiddleware<Ctx, V>): Route<Rewrite<Ctx, V>>;
  go(fn: (ctx: Ctx) => any);
}
