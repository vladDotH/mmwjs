import Router from 'koa-router';
import { createRoute, RMiddleware, Route } from '../route';
import { Rewrite, RType } from '../core';
import { Controller } from './controller.interface';
import { logger } from '../logger';
import chalk from 'chalk';
import { regRoute } from './reg-route';
import { pathExists } from './util';
import { RoutesCollisionError } from './routes-collision-error';
import { chain } from 'lodash';

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

    join(this: Controller, controller: Controller, prefix?: string) {
      if (prefix) {
        if (pathExists(this, prefix)) {
          const errMsg = chalk.red(
            `Failed to join controller by prefix: route ${chalk.blue(
              prefix,
            )} is already in use`,
          );
          logger.error(errMsg, {
            tags: [`Controller ${chalk.blue(this.path)}`],
          });

          throw new RoutesCollisionError(errMsg);
        }

        router.use(prefix, controller.router.routes());
      } else {
        const errors = chain(controller.router.stack)
          .flatMap((route) =>
            route.methods.map((method) => [route.path, method]),
          )
          .map((route) => {
            const matches = this.router.match(route[0], route[1]);
            if (matches.pathAndMethod.length) {
              const errMsg = chalk.red(
                `Failed to merge controllers: route [${chalk.magenta(
                  route[1],
                )}] ${chalk.blue(route[0])} is already in use`,
              );
              logger.error(errMsg, {
                tags: [`Controller ${chalk.blue(this.path)}`],
              });
              return errMsg;
            }
          })
          .compact()
          .value();

        if (errors.length) {
          throw new RoutesCollisionError(
            chalk.red(
              `Some errors occurred during controllers merging: ${errors}`,
            ),
          );
        }
        router.use(controller.router.routes());
      }
      logger.info(
        chalk.green(
          `Controller   ${chalk.blue(controller.path)} mounted` +
            (prefix ? ` in ${chalk.blue(this.path + prefix)} ` : ''),
        ),
      );
      return this;
    },
  };
}
