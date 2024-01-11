export type Rewrite<T, V> = Omit<T, keyof V> & V;
export type Save<T, V> = Rewrite<V, T>;
export type PromiseOr<V> = V | Promise<V>;

export type Fn<I = any, O = any> = (value: I) => O;
export type ClassSchema<C> = { new (): C };

export enum RType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  HEAD = 'head',
  ALL = 'all',
}
