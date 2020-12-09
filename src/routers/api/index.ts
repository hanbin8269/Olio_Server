import * as Router from 'koa-router';

import { user } from './user';
import { portfolio } from './portfolio';

const api = new Router();

api.use('/user', user.routes());
api.use('/portfolio', portfolio.routes());

export { api };
