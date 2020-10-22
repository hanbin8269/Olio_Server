import { Context } from 'koa';

const errorHandler = () => {
  return async (ctx: Context, next: Function) => {
    try {
      await next();
    } catch (error) {
      ctx.status = error.status | 500;
      ctx.body = {
        message: error.message,
      };
    }
  };
};

export { errorHandler };
