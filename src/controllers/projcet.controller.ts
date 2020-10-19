import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';

import * as Joi from 'joi';

export const createProject = async (ctx: Context) => {
  const bodyForm = Joi.object().keys({
    title: Joi.string().required(),
    contents: Joi.string(),
    participants: Joi.array().items(Joi.number()),
  });

  ctx.assert(!bodyForm.validate(ctx.request.body).error, 400);

  const prisma = new PrismaClient();

  const newProject = await prisma.project.create({
    data: {
      title: ctx.request.body.title,
      contents: ctx.request.body.contents,
      owner: {
        connect: { userId: ctx.user.userId },
      },
    },
  });

  ctx.status = 201;
  ctx.body = {
    projectId: newProject.projectId,
  };
};
