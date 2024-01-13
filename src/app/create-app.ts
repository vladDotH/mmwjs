import Koa from 'koa';
import { Controller } from '../controller';
import { App } from './app.interface';
import bodyParser from 'koa-bodyparser';
import { logger } from '../logger';
import chalk from 'chalk';

export function createApp(): App {
  const app = new Koa();

  const paths = new Set(),
    warnings: string[] = [];

  app.use(bodyParser());

  return {
    kapp: app,

    listen(port: number) {
      if (warnings.length) {
        logger.warn(
          chalk.red(
            `Some routes are collided! Make sure its not a mistake:\n`,
          ) + chalk.blue(`${warnings.map((str) => `\t-> ${str}`).join('\n')}`),
        );
      }

      app.listen(port);
      return this;
    },

    useController(controller: Controller) {
      controller.router.stack.forEach((route) => {
        if (paths.has(route.path)) {
          const warnMsg = chalk.yellow(
            `Path ${chalk.blue(route.path)} is already in use`,
          );
          warnings.push(route.path);
          logger.warn(warnMsg, {
            tags: [`Controller ${controller.path}`],
          });
        }
        paths.add(route.path);
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
