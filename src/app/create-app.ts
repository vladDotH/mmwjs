import Koa from 'koa';
import { Controller } from '../controller';
import { App } from './app.interface';
import bodyParser from 'koa-bodyparser';
import { logger } from '../logger';
import chalk from 'chalk';
import { ControllersCollisionError } from './controllers-collision-error';

export function createApp(): App {
  const app = new Koa();

  app.use(bodyParser());

  return {
    kapp: app,

    listen(port: number) {
      app.listen(port);
      return this;
    },

    useControllers(controllers: Controller[]) {
      const paths = new Set();
      for (const c of controllers) {
        if (paths.has(c.path)) {
          const errMsg = chalk.red(
            `Controller on path ${chalk.blue(c.path)} already mounted`,
          );
          logger.error(errMsg);
          throw new ControllersCollisionError(errMsg);
        }

        app.use(c.router.routes());
        logger.info(
          chalk.green(
            `Controller   ${chalk.blue(c.path)} mounted in ${chalk.blue('/')}`,
          ),
        );

        paths.add(c.path);
      }
      return this;
    },
  };
}
