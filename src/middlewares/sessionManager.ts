import { Context } from 'koa';

import { PrismaClient } from '@prisma/client';

// 임시적으로 인증 구현, 추후 세션 인증으로 대체
const sessionManager = async (ctx: Context, next: Function) => {
  const prisma = new PrismaClient();

  if (ctx.header.authorization) {
    const user = await prisma.user.findOne({
      where: {
        userId: Number(ctx.header.authorization),
      },
    });

    if (user) {
      ctx.user = user;
    }
  }

  await next();
};

export default sessionManager;
