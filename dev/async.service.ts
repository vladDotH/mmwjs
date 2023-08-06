import { createAsyncService } from '../src/service';

export const asyncService = createAsyncService(async () => {
  const asyncData: { a: number; b: string } = await new Promise((resolve) =>
    resolve({ a: 45163, b: 'async str' }),
  );

  function f1() {
    console.log('async service:', asyncData);
  }

  function f2() {
    return asyncData;
  }

  return { f1, f2 };
});
