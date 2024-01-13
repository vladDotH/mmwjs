import Router from 'koa-router';
import { createRoute, RMiddleware, Route } from '../route';
import { Path, Rewrite, RType, StrongPath } from '../core';
import { Controller } from './controller.interface';
import { logger } from '../logger';
import chalk from 'chalk';
import { regRoute } from './reg-route';

export function createController<P extends Path>(
  path?: StrongPath<P>,
): Controller {
  const router = new Router({ prefix: path });
  return {
    router,
    path,
    middlewares: [],

    use<T, V>(fn: RMiddleware<T, V>): Controller<Rewrite<T, V>> {
      this.middlewares.push(fn);
      return this;
    },

    get(path: Path) {
      return createRoute(RType.GET, path, this.getReg());
    },
    post(path: Path) {
      return createRoute(RType.POST, path, this.getReg());
    },
    put(path: Path) {
      return createRoute(RType.PUT, path, this.getReg());
    },
    delete(path: Path) {
      return createRoute(RType.DELETE, path, this.getReg());
    },
    patch(path: Path) {
      return createRoute(RType.PATCH, path, this.getReg());
    },
    head(path: Path) {
      return createRoute(RType.HEAD, path, this.getReg());
    },
    all(path: Path) {
      return createRoute(RType.ALL, path, this.getReg());
    },

    getReg(this: Controller) {
      return (route: Route) => regRoute(this, route);
    },

    join<P extends Path>(
      this: Controller,
      controller: Controller,
      prefix?: StrongPath<P>,
    ) {
      if (prefix) {
        this.router.use(prefix, controller.router.routes());
      } else {
        this.router.use(controller.router.routes());
      }
      logger.info(
        chalk.green(
          `Controller   ${chalk.blue(controller.path)} mounted` +
            ` in ${chalk.blue(this.path + (prefix ?? ''))}`,
        ),
      );
      return this;
    },
  };
}
