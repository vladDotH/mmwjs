import { RMiddleware } from '../route';
import { validate } from 'class-validator';
import { isFunction } from 'lodash';
import createHttpError from 'http-errors';
import Joi from 'joi';

type Class<C> = { new (): C };

// TODO swagger annotation

function useAsyncJoiBody<C extends object>(
  schema: Joi.ObjectSchema<C>,
): RMiddleware<any, { body: Promise<C> }> {
  return (ctx, kctx) => {
    const res = schema.validateAsync(kctx.request.body);
    return {
      body: new Promise<C>((resolve, reject) => {
        res
          .then((value) => {
            resolve(value);
          })
          .catch((err) => {
            reject(createHttpError(400, err));
          });
      }),
    };
  };
}

function useAsyncClassBody<C extends object>(
  schema: Class<C>,
): RMiddleware<any, { body: Promise<C> }> {
  return (ctx, kctx) => {
    const rawBody = kctx.request.body as object,
      body = new schema();
    for (const key in rawBody) {
      body[key] = rawBody[key];
    }
    const res = validate(body);
    return {
      body: new Promise<C>((resolve, reject) => {
        res.then((value) => {
          if (value.length) {
            reject(createHttpError(400, JSON.stringify(value)));
          } else resolve(rawBody as C);
        });
      }),
    };
  };
}

export function useAsyncBody<C extends object>(
  schema?: Class<C> | Joi.ObjectSchema<C>,
): RMiddleware<any, { body: Promise<C> }> {
  // Joi validator
  if ('validateAsync' in schema) {
    return useAsyncJoiBody(schema);
  }
  // Class-validator
  else if (isFunction(schema)) {
    return useAsyncClassBody(schema);
  }
  // Raw body
  return (ctx, kctx) => {
    return { body: Promise.resolve(kctx.request.body as C) };
  };
}

export function useBody<C extends object>(
  schema?: Class<C> | Joi.ObjectSchema<C>,
): RMiddleware<any, { body: C }> {
  const bodyFn = useAsyncBody(schema);
  return async (ctx, kctx) => {
    const res = bodyFn(ctx, kctx);
    return { body: await (await res).body };
  };
}
