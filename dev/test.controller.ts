import { createController } from '../src/controller';
import { useParams, useReq, useRes } from '../src/middlewares';
import * as ts from './test.service';
import { useAsyncService } from '../src/service';
import { asyncService } from './async.service';

const as = useAsyncService(asyncService);

export const testController = createController('/test')
  .use(useReq())
  .use(async () => {
    await new Promise((resolve) => {
      setTimeout(() => resolve(123), 1000);
    });
    return { asyncA: 5, asyncB: 'str' };
  });

testController
  .get('/path/:id/:url')
  .use(useParams({ someId: 'id', url: 'url' }))
  .use(useRes())
  .go((ctx) => {
    console.log('async:', ctx.asyncA, ctx.asyncB);
    console.log(ctx.someId, ctx.url, !!ctx.req, !!ctx.res);
    console.log(as.f2());
    return { id: ctx.someId, url: ctx.url };
  });

testController
  .get('/path2/:id/:url')
  .use(useParams(['id', 'url']))
  .go((ctx) => {
    console.log(ts.f1());
    console.log('async:', ctx.asyncA, ctx.asyncB);
    console.log(ctx.id, ctx.url);
    return 'Hellow world 2';
  });