import { useKoaContextObj } from './use-koa-context-obj';

export function useRes<const K>(name?: K) {
  return useKoaContextObj('res', name);
}
