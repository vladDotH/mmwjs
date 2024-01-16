import { PromiseOr } from '../core';
import { Route } from './route.interface';
import { RouterContext } from 'koa-router';
import { Context } from 'koa';

export interface KoaContext extends Context, Omit<RouterContext, 'state'> {}

export interface MWContext extends KoaContext {
  next: () => PromiseOr<void>;
  end: () => void;
  terminated?: boolean;
}

export type RMiddleware<T, V> = (state: T, ctx: MWContext) => PromiseOr<V>;
export type RRegFn = (route: Route) => void;

export * from './route.interface';
export * from './create-route';
