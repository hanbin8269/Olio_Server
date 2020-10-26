import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';

import * as Joi from 'joi';

const prisma = new PrismaClient();

export const createProject = async (ctx: Context) => {
  // check request body form --------------------------------------------------
  const bodyForm = Joi.object().keys({
    title: Joi.string().required(),
    contents: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    participants: Joi.array().items(Joi.string()),
  });

  ctx.assert(
    !bodyForm.validate(ctx.request.body).error,
    400,
    'invalid body form'
  );

  // check if languages are existing ------------------------------------------
  const languages: string[] = ctx.request.body.languages;
  if (languages) {
    const langResult = await Promise.all(
      languages.map((language) => {
        return prisma.language.findOne({
          where: {
            name: language,
          },
        });
      })
    );

    // check if there are unknown languages
    let wrongLanguages: string[] = [];

    langResult.map((value, i) => {
      if (value === null) {
        wrongLanguages.push(languages[i]);
      }
    });

    ctx.assert(
      wrongLanguages.length == 0,
      400,
      `"${wrongLanguages.join('", "')}" 존재하지 않는 언어입니다.`
    );
  }

  // check if participants are existing ---------------------------------------
  const participants: string[] = ctx.request.body.participants;
  if (participants) {
    const userResult = await Promise.all(
      participants.map((email) => {
        return prisma.user.findOne({
          where: {
            email: email,
          },
        });
      })
    );

    // check if there are unknown participants
    let wrongEmails: string[] = [];

    userResult.map((value, i) => {
      if (value === null) {
        wrongEmails.push(participants[i]);
      }
    });

    ctx.assert(
      wrongEmails.length == 0,
      400,
      `"${wrongEmails.join('", "')}" 존재하지 않는 이메일입니다.`
    );
  }

  // map itmes to create project ----------------------------------------------
  const mappedTags = (ctx.request.body.tags || []).map((tag: string) => {
    return {
      where: { name: tag },
      create: { name: tag },
    };
  });

  const mappedLangs = (languages || []).map((language) => {
    return {
      name: language,
    };
  });

  const mappedParticipants = (participants || []).map((email) => {
    return {
      email: email,
    };
  });

  // create project -----------------------------------------------------------
  const newProject = await prisma.project.create({
    data: {
      title: ctx.request.body.title,
      contents: ctx.request.body.contents,
      owner: {
        connect: { userId: ctx.user.userId },
      },
      tags: {
        connectOrCreate: mappedTags,
      },
      languages: {
        connect: mappedLangs,
      },
      participants: {
        connect: mappedParticipants,
      },
    },
  });

  ctx.status = 201;
  ctx.body = {
    projectId: newProject.projectId,
  };
};

export const deleteProject = async (ctx: Context) => {
  // check query parameter type -----------------------------------------------
  // check projectId exists
  ctx.assert(ctx.params.project, 400);

  const projectId = Number(ctx.params.project);

  // check projectId is number
  ctx.assert(projectId, 400);

  // get project to delete ----------------------------------------------------
  const project = await prisma.project.findOne({
    where: {
      projectId: projectId,
    },
  });

  // check project exists
  ctx.assert(project, 400);

  // check project can be deleted
  ctx.assert(project.ownerId == ctx.user.userId, 403);

  // delete project -----------------------------------------------------------
  await prisma.project.delete({
    where: {
      projectId: project.projectId,
    },
  });

  ctx.status = 204;
};
