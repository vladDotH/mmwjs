import multer from '@koa/multer';
import { RMiddleware } from '../route';
import { fromPairs, identity, isFunction, isNumber, noop } from 'lodash';
import { Next } from 'koa';
import { PipeOrFn } from '../pipe';

export function useFiles(options?: multer.Options) {
  const upload = multer(options);

  function single<T, F extends string>(
    fieldName: F,
  ): RMiddleware<T, Record<F, multer.File>>;

  function single<T, F extends string, R>(
    fieldName: F,
    pipe: PipeOrFn<multer.File, R>,
  ): RMiddleware<T, Record<F, R>>;

  function single<T, F extends string>(
    fieldName: F,
    pipe?: PipeOrFn,
  ): RMiddleware<T, Record<F, any>> {
    const fn = pipe ?? identity;
    return async (state, ctx) => {
      await upload.single(fieldName)(ctx, noop as Next);
      return { [fieldName]: fn(ctx.file) } as Record<F, any>;
    };
  }

  function fields<T, const F extends string>(
    fields: { name: F; maxCount: number }[],
  ): RMiddleware<T, Record<F, multer.File[]>>;

  function fields<T, const F extends string, R>(
    fields: { name: F; maxCount: number }[],
    pipe: PipeOrFn<multer.File[], R>,
  ): RMiddleware<T, Record<F, R>>;

  function fields<T, const F extends string>(
    fields: { name: F; maxCount: number }[],
    pipe?: PipeOrFn,
  ): RMiddleware<T, Record<F, any>> {
    const fn = pipe ?? identity;
    return async (state, ctx) => {
      await upload.fields(fields)(ctx, noop as Next);

      return fromPairs(
        fields.map((field) => [
          field.name,
          fn((ctx.files as Record<string, multer.File[]>)[field.name]),
        ]),
      ) as Record<F, any>;
    };
  }

  function array<T, F extends string>(
    name: F,
  ): RMiddleware<T, Record<F, multer.File>>;

  function array<T, F extends string>(
    name: F,
    maxCount: number,
  ): RMiddleware<T, Record<F, multer.File>>;

  function array<T, F extends string, R>(
    name: F,
    pipe: PipeOrFn<multer.File[], R>,
  ): RMiddleware<T, Record<F, R>>;

  function array<T, F extends string, R>(
    name: F,
    maxCount: number,
    pipe: PipeOrFn<multer.File[], R>,
  ): RMiddleware<T, Record<F, R>>;

  function array<T, F extends string>(
    name: F,
    countOrPipe?: number | PipeOrFn,
    pipe?: PipeOrFn,
  ): RMiddleware<T, Record<F, any>> {
    const fn = pipe ?? (isFunction(countOrPipe) ? countOrPipe : identity),
      maxCount = isNumber(countOrPipe) ? countOrPipe : undefined;

    return async (state, ctx) => {
      await upload.array(name, maxCount)(ctx, noop as Next);
      return { [name]: fn(ctx.files) } as Record<F, any>;
    };
  }

  function any<T>(): RMiddleware<T, Record<'files', multer.File[]>>;

  function any<T, R>(
    pipe: PipeOrFn<multer.File[], R>,
  ): RMiddleware<T, Record<'files', R>>;

  function any<T>(pipe?: PipeOrFn): RMiddleware<T, Record<'files', any>> {
    const fn = pipe ?? identity;
    return async (state, ctx) => {
      await upload.any()(ctx, noop as Next);
      return { files: fn(ctx.files) as multer.File[] };
    };
  }

  return {
    single,
    fields,
    array,
    any,
  };
}
