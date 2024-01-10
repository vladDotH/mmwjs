import { createController } from '../src/controller';
import { useKoaContextObj, useParam, useReq, useRes } from '../src/middlewares';
import * as ts from './test.service';
import { useAsyncService } from '../src/service';
import { asyncService } from './async.service';
import { useBody } from '../src/middlewares/use-body';
import { innerController } from './inner-test.controller';
import * as fs from 'fs';
import createHttpError from 'http-errors';
import { ClassSchema, JoiSchema, JoiType } from './validation';
import { awaitService } from '../src/middlewares/await-service';

const as = useAsyncService(asyncService);

export const testController = createController('/test')
  .use(useReq())
  .use(awaitService(asyncService))
  .use(async () => {
    await new Promise((resolve) => {
      setTimeout(() => resolve(123), 1000);
    });
    return { asyncA: 5, asyncB: 'str' };
  });

testController
  .get('/path/:id/:url')
  .use(useRes())
  .use(useParam('url', parseFloat))
  .use(useParam('someId', 'id'))
  .use(useKoaContextObj('query'))
  .go((ctx) => {
    console.log('query: ', ctx.query);
    console.log('async:', ctx.asyncA, ctx.asyncB);
    console.log(as.f2());
    console.log({ id: ctx.someId, url: ctx.url });
    return { id: ctx.someId, url: ctx.url };
  });

testController
  .post('/path/:id/:url/class')
  .use(useBody(ClassSchema))
  .go((ctx) => {
    console.log(`body ${JSON.stringify(ctx.body)}`);
    return `OK class: ${JSON.stringify(ctx.body)}`;
  });

testController
  .post('/path/:id/:url/joi')
  .use(useBody<JoiType>(JoiSchema))
  .go((ctx) => {
    console.log(`body ${JSON.stringify(ctx.body)}`);
    return `OK joi: ${JSON.stringify(ctx.body)}`;
  });

testController
  .get('/path2/:id/:url')
  .use(useParam('id'))
  .use(useParam('url'))
  .go((ctx) => {
    console.log(ts.f1());
    console.log('async:', ctx.asyncA, ctx.asyncB);
    console.log(ctx.id, ctx.url);
    return 'Hellow world 2';
  });

testController
  .get('/error')
  .use(() => {
    return {
      asyncData: new Promise<number>((resolve) => {
        resolve(123);
      }),
    };
  })
  .go(async (ctx) => {
    console.log('async middleware:', await ctx.asyncData);
    throw createHttpError(418, 'Error!!!!!!!!!!!!!!!!!!!!');
    return 'Something';
  });

testController.get('/file').go(() => {
  return fs.createReadStream('./package.json');
});

testController.join(innerController, '/prefix');
