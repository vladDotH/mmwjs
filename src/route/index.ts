import { PromiseOr } from '../core';
import { Route } from './route.interface';
import { RouterContext } from 'koa-router';

export interface MWContext extends RouterContext {
  next: () => PromiseOr<void>;
  end: () => void;
}

export type RMiddleware<T, V> = (ctx: T, kctx: MWContext) => PromiseOr<V>;
export type RRegFn = (route: Route) => void;

export * from './route.interface';
export * from './create-route';
