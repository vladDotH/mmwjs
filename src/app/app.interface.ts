import Koa from 'koa';
import { Controller } from '../controller';

export interface App {
  kapp: Koa;
  listen(port: number): this;

  use(fn: (app: App) => void): this;

  useController(controller: Controller): this;
  useControllers(controllers: Controller[]): this;
}
