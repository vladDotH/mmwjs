import Koa from 'koa';
import { Controller } from './controller';

export interface App {
  kapp: Koa;
  listen(port: number): this;
  useControllers(controllers: Controller[]): this;
}

export function createApp(): App {
  const app = new Koa();
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
