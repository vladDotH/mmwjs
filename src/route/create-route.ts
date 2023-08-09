import { Rewrite, RType } from '../core';
import Router from 'koa-router';
import { Context, Next } from 'koa';
import { RMiddleware, Route } from './index';

export function createRoute(
  method: RType,
  path: string,
  router: Router,
  mw?: RMiddleware<any, any>[],
): Route {
  return {
    method,
    path,
    router,
    middlewares: mw ?? [],
    use<T, V>(fn: RMiddleware<T, V>): Route<Rewrite<T, V>> {
      this.middlewares.push(fn);
      return this;
    },
    go(this: Route, fn: (ctx: any) => any) {
      this.router[this.method](
        this.path,
        // TODO Error handler
        // Controller + Route MWs
        ...this.middlewares.map(
          (mw) => async (context: Context, next: Next) => {
            context.state = {
              ...context.state,
              // TODO parallel async middlewares (before & after sync. MW-s)
              ...(await mw(context.state, context)),
            };
            return next();
          },
        ),
        // Final handler
        async (context, next) => {
          context.body = await fn(context.state);
          return next();
        },
        // TODO after-handler middlewares
      );
      console.log(`Method ${method} on ${path} mounted`);
    },
  };
}
