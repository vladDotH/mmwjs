import * as Router from 'koa-router';
import { Rewrite, RType } from './core';
import { createRoute, RMiddleware, Route } from './route';

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
}

export function createController(path?: string): Controller {
  const router = new Router({ prefix: path });
  return {
    router,
    path,
    middlewares: [],

    use<T, V>(fn: RMiddleware<T, V>): Controller<Rewrite<T, V>> {
      this.middlewares.push(fn);
      return this;
    },

    get(path: string) {
      return createRoute(RType.GET, path, router, this.middlewares);
    },
    post(path: string) {
      return createRoute(RType.POST, path, router, this.middlewares);
    },
    put(path: string) {
      return createRoute(RType.PUT, path, router, this.middlewares);
    },
    delete(path: string) {
      return createRoute(RType.DELETE, path, router, this.middlewares);
    },
    patch(path: string) {
      return createRoute(RType.PATCH, path, router, this.middlewares);
    },
    head(path: string) {
      return createRoute(RType.HEAD, path, router, this.middlewares);
    },
    all(path: string) {
      return createRoute(RType.ALL, path, router, this.middlewares);
    },
  };
}
