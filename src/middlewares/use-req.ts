import { useKoaContextObj } from './use-koa-context-obj';

export function useReq<const K>(name?: K) {
  return useKoaContextObj('req', name);
}
