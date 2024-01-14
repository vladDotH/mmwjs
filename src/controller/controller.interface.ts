import * as Router from 'koa-router';
import { RMiddleware, Route, RRegFn } from '../route';
import { Path, Rewrite, StrongPath } from '../core';

export interface Controller<State = object> {
  router: Router;
  path: Path;
  middlewares: RMiddleware<any, any>[];

  use<V>(fn: RMiddleware<State, V>): Controller<Rewrite<State, V>>;

  get(path: Path): Route<State>;
  post(path: Path): Route<State>;
  put(path: Path): Route<State>;
  delete(path: Path): Route<State>;
  patch(path: Path): Route<State>;
  head(path: Path): Route<State>;
  all(path: Path): Route<State>;

  getReg(): RRegFn;

  join<P extends Path>(controller: Controller, prefix?: StrongPath<P>): this;
}
