import * as Router from 'koa-router';
import { RMiddleware, Route, RRegFn } from '../route';
import { Rewrite } from '../core';

export interface Controller<Ctx = object> {
  router: Router;
  path: string;
  middlewares: RMiddleware<any, any>[];

  use<V>(fn: RMiddleware<Ctx, V>): Controller<Rewrite<Ctx, V>>;

  get(path: string): Route<Ctx>;
  post(path: string): Route<Ctx>;
  put(path: string): Route<Ctx>;
  delete(path: string): Route<Ctx>;
  patch(path: string): Route<Ctx>;
  head(path: string): Route<Ctx>;
  all(path: string): Route<Ctx>;

  getReg(): RRegFn;

  join(controller: Controller, prefix?: string): this;
}
