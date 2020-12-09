import * as Router from 'koa-router';

import { createPortfolio } from '../../../../controllers/portfolio.controller';

const v1 = new Router();

v1.post('/', createPortfolio);

export { v1 };
