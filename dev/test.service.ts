import { useAsyncService } from '../src/service';
import { asyncService } from './async.service';

const as = useAsyncService(asyncService);

export function f1() {
  console.log('testService: ');
  as.f1();
  return as.f2();
}
