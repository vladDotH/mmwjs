import { Path, Rewrite, RType } from '../core';
import { RMiddleware, RRegFn } from './index';

export interface Route<State = object> {
  method: RType;
  path: Path;
  middlewares: RMiddleware<any, any>[];

  regFn: RRegFn;

  use<V>(fn: RMiddleware<State, V>): Route<Rewrite<State, V>>;
  go(fn: (state: State) => any): void;
}
