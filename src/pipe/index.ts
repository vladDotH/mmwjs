type Fn<I = any, O = any> = (value: I) => O;

export interface Pipe<I = any, O = any> {
  (value: I): O;
  add<T>(pipe: Pipe<O, T> | Fn<O, T>): Pipe<I, T>;
}

export type PipeOrFn<I = any, O = any> = Fn<I, O> | Pipe<I, O>;

export function createPipe<I, O>(fn: PipeOrFn<I, O>): Pipe<I, O> {
  const pipe = fn.bind({}) as Pipe;

  pipe.add = function addPipe<I, O, T>(
    this: Pipe<I, O>,
    pipe: PipeOrFn<O, T>,
  ): Pipe<I, T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const prevFn = this;

    const fn = function (value: I) {
      return pipe(prevFn(value));
    } as Pipe;

    fn.add = function (pipe: Pipe | Fn) {
      return addPipe.bind(this)(pipe);
    };

    return fn;
  };

  return pipe;
}
