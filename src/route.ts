import Router from 'koa-router';
import { PromiseOr, Rewrite, RType } from './core';
import { Context, Next } from 'koa';

export type RMiddleware<T, V> = (ctx: T, kctx: Context) => PromiseOr<V>;

export interface Route<Ctx = object> {
  method: RType;
  path: string;
  router: Router;
  middlewares: RMiddleware<any, any>[];

  use<V>(fn: RMiddleware<Ctx, V>): Route<Rewrite<Ctx, V>>;
  go(fn: (ctx: Ctx) => any);
}

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
      console.log(`Method ${method} on ${path} connected`);
    },
  };
}
