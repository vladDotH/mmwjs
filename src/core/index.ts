export type Rewrite<T, V> = Omit<T, keyof V> & V;
export type Save<T, V> = Rewrite<V, T>;
export type PromiseOr<V> = V | Promise<V>;

export enum RType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  HEAD = 'head',
  ALL = 'all',
}
