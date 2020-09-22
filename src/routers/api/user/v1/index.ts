import * as Router from 'koa-router';

import { createUser, login } from '../../../../controllers/user.controller';

const v1 = new Router();

v1.post('/', createUser);
v1.post('/login', login);

export { v1 };
