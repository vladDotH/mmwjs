import { RMiddleware } from '../route';

type Class<C> = { new (): C };

// TODO class-validation (~& joi)
export function useBody<C>(schema?: Class<C>): RMiddleware<any, { body: C }> {
  return (ctx, kctx) => {
    return { body: kctx.request.body as C };
  };
}
