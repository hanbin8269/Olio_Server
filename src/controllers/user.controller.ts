import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';

import * as Joi from 'joi';
import * as crypto from 'crypto';

export const login = async (ctx: Context) => {
  const bodyForm = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  // 요청한 내용의 형식이 올바르지 않음
  ctx.assert(!bodyForm.validate(ctx.request.body).error, 400);

  const prisma = new PrismaClient();

  // 패스워드 해싱
  const hashedPassword = crypto
    .createHmac(process.env.HASH_ALGORITHM, process.env.PW_HASH_KEY)
    .update(ctx.request.body.password)
    .digest()
    .toString();

  // 유저 정보 검색
  const user = (
    await prisma.user.findMany({
      where: {
        email: ctx.request.body.email,
        password: hashedPassword,
      },
    })
  )[0];
  // 로그인 정보가 올바르지 않음
  ctx.assert(user, 400);

  // 응답 반환
  ctx.status = 200;
  ctx.body = {
    id: user.userId,
  };
};

export const createUser = async (ctx: Context) => {
  const bodyForm = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  // 요청한 내용의 형식이 올바르지 않음
  ctx.assert(!bodyForm.validate(ctx.request.body).error, 400);

  const prisma = new PrismaClient();

  // 이미 존재하는 이메일
  ctx.assert(
    !(await prisma.user.findOne({
      where: {
        email: ctx.request.body.email,
      },
    })),
    400
  );

  // 패스워드 해싱
  const hashedPassword = crypto
    .createHmac(process.env.HASH_ALGORITHM, process.env.PW_HASH_KEY)
    .update(ctx.request.body.password)
    .digest()
    .toString();

  // 유저 생성
  const user = await prisma.user.create({
    data: {
      email: ctx.request.body.email,
      password: hashedPassword,
    },
  });

  // 응답 반환
  ctx.status = 201;
  ctx.body = {
    email: user.email,
  };
};
