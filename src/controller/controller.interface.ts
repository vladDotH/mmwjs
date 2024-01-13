import * as Router from 'koa-router';
import { RMiddleware, Route, RRegFn } from '../route';
import { Path, Rewrite, StrongPath } from '../core';

export interface Controller<Ctx = object> {
  router: Router;
  path: Path;
  middlewares: RMiddleware<any, any>[];

  use<V>(fn: RMiddleware<Ctx, V>): Controller<Rewrite<Ctx, V>>;

  get(path: Path): Route<Ctx>;
  post(path: Path): Route<Ctx>;
  put(path: Path): Route<Ctx>;
  delete(path: Path): Route<Ctx>;
  patch(path: Path): Route<Ctx>;
  head(path: Path): Route<Ctx>;
  all(path: Path): Route<Ctx>;

  getReg(): RRegFn;

  join<P extends Path>(controller: Controller, prefix?: StrongPath<P>): this;
}
