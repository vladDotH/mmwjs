import { RMiddleware } from '../route';
import { validate } from 'class-validator';
import { isFunction } from 'lodash';
import createHttpError from 'http-errors';
import Joi from 'joi';

type Class<C> = { new (): C };

// TODO swagger annotation
export function useBody<C extends object>(
  schema?: Class<C> | Joi.ObjectSchema<C>,
): RMiddleware<any, { body: C }> {
  return async (ctx, kctx) => {
    const rawBody = kctx.request.body as object;

    // Joi validation
    if ('validate' in schema) {
      const res = schema.validate(rawBody);

      if (res.error) {
        throw createHttpError(400, res.error);
      }

      return { body: res.value };
    }
    // Class-validator validation
    else if (isFunction(schema)) {
      const body = new schema();

      for (const key in rawBody) {
        body[key] = rawBody[key];
      }
      const res = await validate(body);

      if (res.length) {
        throw createHttpError(400, JSON.stringify(res));
      }

      return { body: rawBody as C };
    }

    return { body: kctx.request.body as C };
  };
}
