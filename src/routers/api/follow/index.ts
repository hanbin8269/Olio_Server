import * as Router from 'koa-router';

import { following } from '../../../controllers/follow.controller';

const follow = new Router();

follow.post('/', following);

export { follow };
