import { Context } from 'koa';
import { PrismaClient, prismaVersion } from '@prisma/client';

import * as Joi from 'joi';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

export const createPortfolio = async (ctx: Context) => {
  const bodyForm = Joi.object().keys({
    title: Joi.string().required(),
    projects: Joi.array().items(Joi.number()),
  });

  ctx.assert(
    !bodyForm.validate(ctx.request.body).error,
    400,
    'invalid body form'
  );

  // check if projects are existing
  const projects: number[] = ctx.request.body.projects;
  if (projects) {
    const projectList = await Promise.all(
      projects.map((project) => {
        return prisma.project.findOne({
          where: {
            projectId: project,
          },
        });
      })
    );

    let wrongProjects: number[] = [];

    projectList.map((value, i) => {
      if (value === null) {
        wrongProjects.push(projects[i]);
      }
    });

    ctx.assert(
      wrongProjects.length == 0,
      400,
      `"${wrongProjects.join('", "')}" 존재하지 않는 프로젝트입니다`
    );
  }

  // 포트폴리오 생성
  const mappedProjects = (projects || []).map((project) => {
    return {
      projectId: project,
    };
  });

  const newPortfolio = await prisma.portfolio.create({
    data: {
      title: ctx.request.body.title,
      // owner : {
      //   connect : {userId : 쿠키의 uid 값},
      // },
      projects: {
        connect: mappedProjects,
      },
    },
  });

  ctx.status = 201;
  ctx.body = {
    portfolioId: newPortfolio.portfolioId,
  };
};

export const readPortfolio = async (ctx: Context) => {};

export const updatePortfolio = async (ctx: Context) => {};

export const deletePortfolio = async (ctx: Context) => {};
