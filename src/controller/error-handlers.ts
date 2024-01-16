import { Controller } from './controller.interface';
import { KoaContext, MWContext, Route } from '../route';
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

export async function terminatedHandler(ctx: MWContext, next: Next) {
  await next();
  if (!ctx.terminated) {
    logger.warn(
      `Request [${chalk.magenta(ctx.method)}] ` +
        `${chalk.blue(ctx.path)} has not been terminated, ` +
        `make sure you ${chalk.magenta('await')} or ` +
        `${chalk.blue('return')} all next() handlers`,
    );
  }
}
