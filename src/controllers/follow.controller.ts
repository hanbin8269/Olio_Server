import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';

import * as Joi from 'joi';
const prisma = new PrismaClient();

export const following = async (ctx: Context) => {
  // check request body form
  const bodyForm = Joi.object().keys({
    userId: Joi.number().integer().required(),
  });

  ctx.assert(!bodyForm.validate(ctx.request.body).error, 400);

  await prisma.user.update({
    where: {
      userId: ctx.user.userId,
    },
    data: {
      following: {
        connect: {
          userId: ctx.request.body.userId,
        },
      },
    },
  });

  //check if user is existing
  const checkUser = prisma.user.findOne({
    where: {
      userId: ctx.request.body.userId,
    },
  });

  ctx.assert(!checkUser, 400);
};
