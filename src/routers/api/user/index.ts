import * as Router from 'koa-router';

import { v1 } from './v1';

const user = new Router();

user.use('/v1', v1.routes());

export { user };
