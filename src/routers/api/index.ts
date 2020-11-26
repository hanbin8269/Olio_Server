import * as Router from 'koa-router';

import { user } from './user';
import { follow } from './follow';

const api = new Router();

api.use('/user', user.routes());
api.use('/follow', follow.routes());

export { api };
