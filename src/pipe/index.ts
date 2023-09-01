export interface Pipe<I = any, O = any> {
  apply(value: I): O;
  add<T>(pipe: Pipe<O, T>): Pipe<I, T>;
}

export function addPipe<I, O, T>(
  this: Pipe<I, O>,
  pipe: Pipe<O, T>,
): Pipe<I, T> {
  const prevFn = this.apply;
  return {
    apply(value: I): T {
      return pipe.apply(prevFn(value));
    },
    add(pipe: Pipe) {
      return addPipe.bind(this)(pipe);
    },
  };
}

export function createPipe<I, O>(fn: (val: I) => O): Pipe<I, O> {
  return {
    apply: fn,
    add(pipe: Pipe) {
      return addPipe.bind(this)(pipe);
    },
  };
}
