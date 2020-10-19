import * as Router from 'koa-router';

import { user } from './user';
import { project } from './project';

const api = new Router();

api.use('/user', user.routes());
api.use('/project', project.routes());

export { api };
