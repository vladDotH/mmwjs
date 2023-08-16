import { Controller } from './controller.interface';
import { Route } from '../route';
import { Context, Next } from 'koa';
import { logger } from '../logger';
import chalk from 'chalk';
import { createErrorHandler } from './create-error-handler';

export function regRoute(controller: Controller, route: Route) {
  const rMiddlewares = route.middlewares.slice(0, -1),
    handler = route.middlewares.slice(-1)[0];

  controller.router[route.method](
    route.path,

    createErrorHandler(controller, route),

    // Controller & route MWs
    ...[...controller.middlewares, ...rMiddlewares].map(
      (mw) => async (context: Context, next: Next) => {
        context.state = {
          ...context.state,
          ...(await mw(context.state, context)),
        };
        return next();
      },
    ),

    // Final handler
    async (context, next) => {
      context.body = await handler(context.state, undefined);
      return next();
    },
    // TODO after-handler middlewares
  );
  logger.info(
    chalk.green(
      `Route ${route.method.toUpperCase().padEnd(6)} ${chalk.blue(
        route.path,
      )} mounted in ${chalk.blue(controller.path)}`,
    ),
  );
}
