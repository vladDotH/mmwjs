import { createApp } from '../src/app';
import { testController } from './test.controller';
import { useSessionPlugin } from '../src/plugins/use-session.plugin';

const app = createApp();

app.use(useSessionPlugin(['secret'], { key: 'session-key' }));
app.useControllers([testController]);
app.listen(3000);
