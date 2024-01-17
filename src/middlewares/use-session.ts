import session from 'koa-session';
import { RMiddleware } from '../route';

export function useSession<T extends object>(): RMiddleware<
  any,
  { session: session.Session & T }
> {
  return async (state, ctx) => ({ session: ctx.session as any });
}
