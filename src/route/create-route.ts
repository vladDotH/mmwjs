import { Rewrite, RType } from '../core';
import Router from 'koa-router';
import { Context, Next } from 'koa';
import { RMiddleware, Route } from './index';
import { logger } from '../logger';
import chalk from 'chalk';

// Todo inverse route dependency from controller (pass callback to register route)
export function createRoute(
  method: RType,
  path: string,
  router: Router,
  mw?: RMiddleware<any, any>[],
): Route {
  return {
    method,
    path,
    router,
    middlewares: mw ?? [],
    use<T, V>(fn: RMiddleware<T, V>): Route<Rewrite<T, V>> {
      this.middlewares.push(fn);
      return this;
    },
    go(this: Route, fn: (ctx: any) => any) {
      this.router[this.method](
        this.path,
        // TODO Error handler
        // Controller + Route MWs
        ...this.middlewares.map(
          (mw) => async (context: Context, next: Next) => {
            context.state = {
              ...context.state,
              // TODO parallel async middlewares (before & after sync. MW-s)
              ...(await mw(context.state, context)),
            };
            return next();
          },
        ),
        // Final handler
        async (context, next) => {
          context.body = await fn(context.state);
          return next();
        },
        // TODO after-handler middlewares
      );
      logger.info(
        chalk.green(
          `Method ${method.toUpperCase().padEnd(6)} on ${chalk.blue(
            path,
          )} mounted`,
        ),
      );
    },
  };
}
