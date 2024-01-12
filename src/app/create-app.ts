import Koa from 'koa';
import { Controller } from '../controller';
import { App } from './app.interface';
import bodyParser from 'koa-bodyparser';
import { logger } from '../logger';
import chalk from 'chalk';
import { ControllersCollisionError } from './controllers-collision-error';

export function createApp(): App {
  const app = new Koa();

  const paths = new Set(),
    errors: string[] = [];

  app.use(bodyParser());

  return {
    kapp: app,

    listen(port: number) {
      if (errors.length) {
        throw new ControllersCollisionError(
          chalk.red(`Some controllers collided: ${errors.join(', ')}`),
        );
      }

      app.listen(port);
      return this;
    },

    useController(controller: Controller) {
      if (paths.has(controller.path)) {
        const errMsg = chalk.red(
          `Controller on path ${chalk.blue(controller.path)} already mounted`,
        );
        logger.error(errMsg);
        errors.push(controller.path);
      } else {
        app.use(controller.router.routes());
        logger.info(
          chalk.green(
            `Controller   ${chalk.blue(
              controller.path,
            )} mounted in ${chalk.blue('/')}`,
          ),
        );

        paths.add(controller.path);
      }

      return this;
    },

    useControllers(controllers: Controller[]) {
      controllers.map(this.useController);
      return this;
    },
  };
}
