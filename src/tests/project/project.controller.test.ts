import { PrismaClient } from '@prisma/client';
import { expression } from 'joi';
import * as request from 'supertest';
import app from '../../app';

let mockUserToken: string;

const mockUser1 = {
  email: 'mockuser12341@example.com',
  password: 'mypassword',
};

const mockUser2 = {
  email: 'mockuser12342@example.com',
  password: 'mypassword',
};

beforeAll(async () => {
  require('../../server');

  const user1 = request(app.callback()).post('/api/user/v1').send(mockUser1);
  const user2 = request(app.callback()).post('/api/user/v1').send(mockUser1);
  await Promise.all([user1, user2]);

  mockUserToken = (
    await request(app.callback()).post('/api/user/v1/login').send(mockUser1)
  ).body.userId;
});

afterAll(async () => {
  const prisma = new PrismaClient();

  await prisma.user.deleteMany({
    where: {
      OR: [{ email: mockUser1.email }, { email: mockUser2.email }],
    },
  });
});

describe('project creation', async () => {
  const mockProject = {
    projectId: 99999,
    title: 'My First Project',
    contents: 'This is a project for testing',
  };

  it('should fail with invalid bodyForm', async () => {
    const response = await request(app.callback())
      .post('/api/project')
      .set('Authorization', mockUserToken)
      .send({ contents: 'posting without title' });

    expect(response.status).toBe(400);
  });

  it('should fail without user auth', async () => {
    const response = await request(app.callback())
      .post('/api/project')
      .send(mockProject);

    expect(response.status).toBe(403);
  });

  it('should create project', async () => {
    const response = await request(app.callback())
      .post('/api/project')
      .set('Authorization', mockUserToken)
      .send(mockProject);

    expect(response.status).toBe(201);
    expect(response.body.projectId).toBe(mockProject.projectId);
  });
});
