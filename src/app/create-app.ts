import Koa from 'koa';
import { Controller } from '../controller';
import { App } from './app.interface';
import * as bodyParser from 'koa-bodyparser';

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
        console.log(`Controller on ${c.path} connected`);
        app.use(c.router.routes());
      }
      return this;
    },
  };
}
