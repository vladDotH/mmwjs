import Koa from 'koa';
import { Controller } from '../controller';
import { App } from './app.interface';
import bodyParser from 'koa-bodyparser';
import { logger } from '../logger';
import chalk from 'chalk';

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
      for (const c of controllers) {
        logger.info(chalk.green(`Controller on ${chalk.blue(c.path)} mounted`));
        app.use(c.router.routes());
      }
      return this;
    },
  };
}
