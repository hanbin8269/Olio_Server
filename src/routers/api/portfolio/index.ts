import * as Router from 'koa-router';

import { v1 } from './v1';

const portfolio = new Router();

portfolio.use('/v1', v1.routes());

export { portfolio };
