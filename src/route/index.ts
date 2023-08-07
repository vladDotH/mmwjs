import { Context } from 'koa';
import { PromiseOr } from '../core';

export type RMiddleware<T, V> = (ctx: T, kctx: Context) => PromiseOr<V>;

export * from './route.interface';
export * from './create-route';
