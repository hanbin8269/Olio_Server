import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as helmet from "koa-helmet";

import { router } from './routers';

const app = new Koa();

app.use(helmet())
    .use(bodyParser())
    .use(router.routes()).use(router.allowedMethods());

export default app;
