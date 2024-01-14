import { Controller } from './controller.interface';
import { KoaContext, MWContext, Route } from '../route';
import { Next } from 'koa';
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
      (mw) => async (context: KoaContext, next: Next) => {
        let callNext = false,
          end = false;

        context.next = () => {
          if (!callNext) {
            callNext = true;
            return next();
          }
        };

        context.end = () => {
          end = true;
        };

        context.state = {
          ...context.state,
          ...(await mw(context.state, context as MWContext)),
        };

        if (!end && !callNext) return next();
      },
    ),

    // Final handler
    async (context, next) => {
      context.body = await handler(context.state, undefined);
      return next();
    },
  );

  logger.info(
    chalk.green(
      `Route ${route.method.toUpperCase().padEnd(6)} ${chalk.blue(
        route.path,
      )} mounted in ${chalk.blue(controller.path)}`,
    ),
  );
}
