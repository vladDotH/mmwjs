import { Context } from 'koa';
import { PromiseOr } from '../core';
import { Route } from './route.interface';

export type RMiddleware<T, V> = (ctx: T, kctx: Context) => PromiseOr<V>;
export type RRegFn = (route: Route) => void;

export * from './route.interface';
export * from './create-route';
