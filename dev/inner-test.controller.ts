import { createController } from '../src/controller';
import { useParam } from '../src/middlewares';

export const innerController = createController('/inner');

innerController.get('/').go(() => {
  console.log('inner default');
  return 'Response from inner route / ';
});

innerController.get('/test-inner').go(() => {
  console.log('test-inner default');
  return 'Response from inner route /test-inner';
});

innerController
  .get('/test-inner/:id')
  .use(useParam('id'))
  .go((ctx) => {
    console.log('inner: ', ctx.id);
    return `Response from test-inner ${ctx.id}`;
  });
