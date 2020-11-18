import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as koaBody from 'koa-body';

import { sessionManager } from './middlewares';
import { router } from './routers';
import { errorHandler } from './middlewares';

const app = new Koa();

app
  .use(helmet())
  .use(bodyParser())
  .use(koaBody({ multipart: true }))
  .use(errorHandler())
  .use(sessionManager)
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
