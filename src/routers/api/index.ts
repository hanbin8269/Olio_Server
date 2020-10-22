import * as Router from 'koa-router';

import { user } from './user';
import { project } from './project';
import { loginRequired } from '../../middlewares/authorityChecker';

const api = new Router();

api.use('/user', user.routes());
api.use('/project', loginRequired, project.routes());

export { api };
