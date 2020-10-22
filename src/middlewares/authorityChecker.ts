import { Context } from 'koa';

export enum Authority {
  unknown = 0,
  student = 1,
  manager = 2,
  admin = 3,
}

export const loginRequired = async (ctx: Context, next: Function) => {
  ctx.assert(ctx.user, 401);

  await next();
};

export const authorityRequired = (authority: Authority) => {
  return async (ctx: Context, next: Function) => {
    ctx.assert(ctx.user.authority >= authority, 403);

    await next();
  };
};
