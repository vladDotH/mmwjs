import Router from 'koa-router';
import { createRoute, RMiddleware, Route } from '../route';
import { Rewrite, RType } from '../core';
import { Controller } from './controller.interface';
import { logger } from '../logger';
import chalk from 'chalk';
import { regRoute } from './reg-route';

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
      return createRoute(RType.GET, path, this.getReg());
    },
    post(path: string) {
      return createRoute(RType.POST, path, this.getReg());
    },
    put(path: string) {
      return createRoute(RType.PUT, path, this.getReg());
    },
    delete(path: string) {
      return createRoute(RType.DELETE, path, this.getReg());
    },
    patch(path: string) {
      return createRoute(RType.PATCH, path, this.getReg());
    },
    head(path: string) {
      return createRoute(RType.HEAD, path, this.getReg());
    },
    all(path: string) {
      return createRoute(RType.ALL, path, this.getReg());
    },

    getReg(this: Controller) {
      return (route: Route) => regRoute(this, route);
    },

    join(ctrl: Controller, prefix: string) {
      if (prefix) {
        router.use(prefix, ctrl.router.routes());
      } else {
        router.use(ctrl.router.routes());
      }
      logger.info(
        chalk.green(
          `Controller   ${chalk.blue(ctrl.path)} mounted` +
            (prefix ? ` in ${chalk.blue(this.path + prefix)} ` : ''),
        ),
      );
      return this;
    },
  };
}
