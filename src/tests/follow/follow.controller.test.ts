import * as request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';

let mockUserToken: string;
let mockUserId: number;

beforeAll(async () => {
  require('../../server');

  const mockUser1 = {
    email: 'mockuser1@example.com',
    password: '1234',
  };
  const mockUser2 = {
    email: 'mockuser2@example.com',
    password: '5678',
  };

  await request(app.callback()).post('/api/user/v1/').send(mockUser1);
  await request(app.callback()).post('/api/user/v1/').send(mockUser2);

  const token = await request(app.callback())
    .post('/api/user/v1/login')
    .send(mockUser1);

  mockUserToken = token.body.userId;

  const prisma = new PrismaClient();

  const user = await prisma.user.findOne({
    where: {
      email: 'mockuser2@example.com',
    },
  });

  mockUserId = user.userId;
});

describe('Follow works', () => {
  it('should follow the user', async () => {
    const response = await request(app.callback())
      .post('/api/follow')
      .set('Authorization', mockUserToken)
      .send({
        id: mockUserId,
      });
  });
});
