import multer from '@koa/multer';
import { RMiddleware } from '../route';
import { fromPairs, noop } from 'lodash';
import { Next } from 'koa';

export function useFiles(options?: multer.Options) {
  const upload = multer(options);

  function single<T, F extends string>(
    fieldName: F,
  ): RMiddleware<T, Record<F, multer.File>> {
    return async (state, ctx) => {
      await upload.single(fieldName)(ctx, noop as Next);
      return { [fieldName]: ctx.file } as Record<F, multer.File>;
    };
  }

  function fields<T, F extends string>(
    fields: { name: F; maxCount: number }[],
  ): RMiddleware<T, Record<F, multer.File[]>> {
    return async (state, ctx) => {
      await upload.fields(fields)(ctx, noop as Next);

      return fromPairs(
        fields.map((field) => [
          field.name,
          (ctx.files as Record<string, multer.File[]>)[field.name],
        ]),
      ) as Record<F, multer.File[]>;
    };
  }

  function array<T, F extends string>(
    name: F,
    maxCount?: number,
  ): RMiddleware<T, Record<F, multer.File>> {
    return async (state, ctx) => {
      await upload.array(name, maxCount)(ctx, noop as Next);
      return { [name]: ctx.file } as Record<F, multer.File>;
    };
  }

  function any<T>(): RMiddleware<T, Record<'files', multer.File[]>> {
    return async (state, ctx) => {
      await upload.any()(ctx, noop as Next);
      return { files: ctx.files as multer.File[] };
    };
  }

  return {
    single,
    fields,
    array,
    any,
  };
}
