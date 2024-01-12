import { createController } from '../src/controller';
import { useParam, useReq, useRes } from '../src/middlewares';
import * as ts from './test.service';
import { useAsyncService } from '../src/service';
import { asyncService } from './async.service';
import { useBody } from '../src/middlewares/use-body';
import { innerController } from './inner-test.controller';
import * as fs from 'fs';
import { ImATeapot, InternalServerError } from 'http-errors';
import { ClassSchema, JoiSchema } from './validation';
import { awaitService } from '../src/middlewares/await-service';
import { validationPipe } from '../src/pipe/pipes/validation';
import { useQuery } from '../src/middlewares/use-query';
import Joi from 'joi';
import { createParseFloatPipe } from '../src/pipe/pipes/parse';

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
  .use(useParam('url', createParseFloatPipe()))
  .use(useParam('someId', 'id'))
  .use(useQuery('qa'))
  .use(useQuery('queryB', 'qb', validationPipe(Joi.string())))
  .go((ctx) => {
    console.log('query qa: ', ctx.qa);
    console.log('query B: ', ctx.queryB);

    console.log('async:', ctx.asyncA, ctx.asyncB);
    console.log(as.f2());
    console.log({ id: ctx.someId, url: ctx.url });
    return { id: ctx.someId, url: ctx.url };
  });

testController
  .post('/path/:id/:url/class')
  .use(useBody(validationPipe(ClassSchema)))
  .go((ctx) => {
    console.log(`body ${JSON.stringify(ctx.body)}`);
    return `OK class: ${JSON.stringify(ctx.body)}`;
  });

testController
  .post('/path/:id/:url/joi')
  .use(useBody(validationPipe(JoiSchema)))
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
    throw new ImATeapot('Error!!!!!!!!!!!!!!!!!!!!');
    return 'Something';
  });

testController.get('/file').go(() => {
  return fs.createReadStream('./package.json');
});

testController
  .get('/intercept')
  .use(async (ctx, kctx) => {
    await kctx.next();
    console.log(kctx.body);
    kctx.body = 'Modified';
  })
  .go(() => {
    return 'Hello world';
  });

testController
  .get('/intercept-error')
  .use(async (ctx, kctx) => {
    try {
      await kctx.next();
    } catch (err) {
      throw new InternalServerError('Intercepted error');
    }
  })
  .go(() => {
    console.log('error occured!!!');
    throw new Error('Critical information');
  });

testController
  .get('/intercept-end')
  .use(async (ctx, kctx) => {
    kctx.body = 'Early returned';
    kctx.end();
  })
  .go(() => {
    throw new Error('Some code');
  });

testController.join(innerController, '/prefix');
