import { Controller } from './controller.interface';
import { KoaContext, Route } from '../route';
import { Next } from 'koa';
import { logger } from '../logger';
import chalk from 'chalk';

export function createErrorHandler(controller: Controller, route: Route) {
  return async (context: KoaContext, next: Next) => {
    try {
      await next();
    } catch (err) {
      logger.error(
        chalk.red(
          `Error in controller ${controller.path} in route ${route.path} | ${err}`,
        ),
      );
      logger.verbose(err.stack?.toString());
      context.status = err.status ?? 500;
      context.body = err.message;
    }
  };
}
