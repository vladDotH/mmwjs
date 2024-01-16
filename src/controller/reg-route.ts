import { Controller } from './controller.interface';
import { MWContext, Route } from '../route';
import { Next } from 'koa';
import { logger } from '../logger';
import chalk from 'chalk';
import { createErrorHandler, terminatedHandler } from './error-handlers';
import { noop } from 'lodash';

export function regRoute(controller: Controller, route: Route) {
  const rMiddlewares = route.middlewares.slice(0, -1),
    handler = route.middlewares.slice(-1)[0];

  controller.router[route.method](
    route.path,

    createErrorHandler(controller, route),

    terminatedHandler,

    // Controller & route MWs
    ...[...controller.middlewares, ...rMiddlewares].map(
      (mw) => async (context: MWContext, next: Next) => {
        context.next = () => {
          const nextFn = next;
          context.next = next = noop as Next;
          return nextFn();
        };

        context.end = () => {
          context.terminated = true;
          next = noop as Next;
        };

        context.state = {
          ...context.state,
          ...(await mw(context.state, context)),
        };

        return next();
      },
    ),

    // Final handler
    async (context: MWContext, next) => {
      context.body = await handler(context.state, undefined);
      context.terminated = true;
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
