import Koa from 'koa';
import { Controller } from '../controller';
import { App } from './app.interface';
import bodyParser from 'koa-bodyparser';
import { logger } from '../logger';
import chalk from 'chalk';
import { intersection, union } from 'lodash';
import { AppPlugin } from './index';

export function createApp(): App {
  const app = new Koa();

  const paths = new Map<string, string[]>(),
    warnings: string[] = [];

  app.use(bodyParser());

  return {
    kapp: app,

    use(fn: AppPlugin) {
      fn(this);
      return this;
    },

    listen(port: number) {
      if (warnings.length) {
        logger.warn(
          chalk.red(
            `Some routes are collided! Make sure it is not a mistake:\n`,
          ) + chalk.blue(`${warnings.map((str) => `\t-> ${str}`).join('\n')}`),
        );
      }

      app.listen(port);
      return this;
    },

    useController(controller: Controller) {
      controller.router.stack.forEach((route) => {
        const prevMethods = paths.get(route.path) ?? [];

        if (intersection(route.methods, prevMethods).length) {
          const warnMsg = chalk.yellow(
            `Path ${chalk.blue(route.path)} is already in use`,
          );
          warnings.push(route.path);
          logger.warn(warnMsg, {
            tags: [`Controller ${controller.path}`],
          });
        }

        paths.set(route.path, union(route.methods, prevMethods));
      });

      app.use(controller.router.routes());
      logger.info(
        chalk.green(
          `Controller   ${chalk.blue(controller.path)} mounted in ${chalk.blue(
            '/',
          )}`,
        ),
      );

      return this;
    },

    useControllers(controllers: Controller[]) {
      controllers.map(this.useController);
      return this;
    },
  };
}
