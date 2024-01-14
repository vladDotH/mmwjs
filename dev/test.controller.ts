import { createController } from '../src/controller';
import { useFiles, useParam, useReq, useRes } from '../src/middlewares';
import * as ts from './test.service';
import { useAsyncService } from '../src/service';
import { asyncService } from './async.service';
import { useBody } from '../src/middlewares/use-body';
import { innerController } from './inner-test.controller';
import * as fs from 'fs';
import { BadRequest, ImATeapot, InternalServerError } from 'http-errors';
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
  .go((state) => {
    console.log('query qa: ', state.qa);
    console.log('query B: ', state.queryB);

    console.log('async:', state.asyncA, state.asyncB);
    console.log(as.f2());
    console.log({ id: state.someId, url: state.url });
    return { id: state.someId, url: state.url };
  });

testController
  .post('/path/:id/:url/class')
  .use(useBody(validationPipe(ClassSchema)))
  .go((state) => {
    console.log(`body ${JSON.stringify(state.body)}`);
    return `OK class: ${JSON.stringify(state.body)}`;
  });

testController
  .post('/path/:id/:url/joi')
  .use(useBody(validationPipe(JoiSchema)))
  .go((state) => {
    console.log(`body ${JSON.stringify(state.body)}`);
    return `OK joi: ${JSON.stringify(state.body)}`;
  });

testController
  .get('/path2/:id/:url')
  .use(useParam('id'))
  .use(useParam('url'))
  .go((state) => {
    console.log(ts.f1());
    console.log('async:', state.asyncA, state.asyncB);
    console.log(state.id, state.url);
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
  .go(async (state) => {
    console.log('async middleware:', await state.asyncData);
    throw new ImATeapot('Error!!!!!!!!!!!!!!!!!!!!');
    return 'Something';
  });

testController.get('/file').go(() => {
  return fs.createReadStream('./package.json');
});

testController
  .get('/intercept')
  .use(async (state, ctx) => {
    await ctx.next();
    console.log(ctx.body);
    ctx.body = 'Modified';
  })
  .go(() => {
    return 'Hello world';
  });

testController
  .get('/intercept-error')
  .use(async (state, ctx) => {
    try {
      await ctx.next();
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
  .use(async (state, ctx) => {
    ctx.body = 'Early returned';
    ctx.end();
  })
  .go(() => {
    throw new Error('Some code');
  });

testController
  .post('/file')
  .use(useFiles().single('file'))
  .go((state) => {
    console.log('File:');
    console.log(state.file);
  });

testController.join(innerController, '/prefix');
