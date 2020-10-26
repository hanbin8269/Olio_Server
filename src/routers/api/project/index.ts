import * as Router from 'koa-router';

import {
  createProject,
  deleteProject,
} from '../../../controllers/projcet.controller';

const project = new Router();

project.post('/', createProject);

project.delete('/:project', deleteProject);

export { project };
