import { createApp } from '../src/app';
import { testController } from './test.controller';

const app = createApp();
app.useControllers([testController]);
app.listen(3000);
