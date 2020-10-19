import * as Router from 'koa-router';

import { createProject } from '../../../controllers/projcet.controller';

const project = new Router();

project.post('/', createProject);

export { project };
