import { PrismaClient } from '@prisma/client';
import { expression } from 'joi';
import * as request from 'supertest';
import app from '../../app';

let mockUserToken: string;
let mockProjectId: number;

const mockUser1 = {
  email: 'mockuser12341@example.com',
  password: 'mypassword',
};

const mockUser2 = {
  email: 'mockuser12342@example.com',
  password: 'mypassword',
};

const mockProject = {
  title: 'My First Project',
  contents: 'This is a project for testing',
};

beforeAll(async () => {
  require('../../server');

  const user1 = request(app.callback()).post('/api/user/v1').send(mockUser1);
  const user2 = request(app.callback()).post('/api/user/v1').send(mockUser2);
  await Promise.all([user1, user2]);

  mockUserToken = (
    await request(app.callback()).post('/api/user/v1/login').send(mockUser1)
  ).body.id;
});

afterAll(async () => {
  const prisma = new PrismaClient();

  await prisma.project.delete({
    where: { projectId: mockProjectId },
  });

  await prisma.user.deleteMany({
    where: {
      OR: [{ email: mockUser1.email }, { email: mockUser2.email }],
    },
  });
});

describe('project creation', () => {
  it('should create project', async () => {
    const response = await request(app.callback())
      .post('/api/project')
      .set('authorization', mockUserToken)
      .send(mockProject);

    expect(response.status).toBe(201);
    mockProjectId = response.body.projectId;
  });

  it('should fail with invalid bodyForm', async () => {
    const response = await request(app.callback())
      .post('/api/project')
      .set('authorization', mockUserToken)
      .send({ contents: 'posting without title' });

    expect(response.status).toBe(400);
  });

  it('should fail without user auth', async () => {
    const response = await request(app.callback())
      .post('/api/project')
      .send(mockProject);

    expect(response.status).toBe(401);
  });
});
