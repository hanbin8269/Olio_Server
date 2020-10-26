import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import app from '../../app';

interface project {
  projectId: number;
  title: string;
}

let mockUserToken: string;

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
  tags: ['AI', 'CNN', '테스팅'],
  languages: ['Python', 'C'],
  participants: [mockUser2.email],
};

beforeAll(async () => {
  require('../../server');

  const user1 = request(app.callback()).post('/api/user/v1').send(mockUser1);
  const user2 = request(app.callback()).post('/api/user/v1').send(mockUser2);
  await Promise.all([user1, user2]);

  const token = await request(app.callback())
    .post('/api/user/v1/login')
    .send(mockUser1);

  mockUserToken = token.body.id;
});

afterAll(async () => {
  const prisma = new PrismaClient();

  await prisma.user.deleteMany({
    where: {
      OR: [{ email: mockUser1.email }, { email: mockUser2.email }],
    },
  });
});

describe('project creation', () => {
  it('should create project', async () => {
    // request to create project-----------------------------------------------
    const response = await request(app.callback())
      .post('/api/project')
      .set('authorization', mockUserToken)
      .send(mockProject);

    // check if project is created --------------------------------------------
    expect(response.status).toBe(201);

    // check if tags are created ----------------------------------------------
    const prisma = new PrismaClient();

    const tagResult = await Promise.all(
      mockProject.tags.map((tag) => {
        return prisma.tag.findMany({
          where: {
            name: tag,
          },
        });
      })
    );

    const mappedTags = mockProject.tags.map((tag) => {
      return [
        {
          name: tag,
        },
      ];
    });
    expect(tagResult).toEqual(mappedTags);
  });

  it('should fail with unknown languages', async () => {
    // project with wrong language --------------------------------------------
    const anotherProject = {
      title: 'My First Project',
      contents: 'This is a project for testing',
      languages: ['wrong'],
    };

    // request to create project ----------------------------------------------
    const response = await request(app.callback())
      .post('/api/project')
      .set('authorization', mockUserToken)
      .send(anotherProject);

    // check if failed to create ----------------------------------------------
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"wrong" 존재하지 않는 언어입니다.');
  });

  it('should fail with unknown users', async () => {
    // project with wrong language --------------------------------------------
    const anotherProject = {
      title: 'My First Project',
      contents: 'This is a project for testing',
      participants: ['unknown'],
    };

    // request to create project ----------------------------------------------
    const response = await request(app.callback())
      .post('/api/project')
      .set('authorization', mockUserToken)
      .send(anotherProject);

    // check if failed to create ----------------------------------------------
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"unknown" 존재하지 않는 이메일입니다.');
  });

  it('should fail with invalid bodyForm', async () => {
    // request to create project ----------------------------------------------
    const response = await request(app.callback())
      .post('/api/project')
      .set('authorization', mockUserToken)
      .send({ contents: 'posting without title' });

    // check if failed to create ----------------------------------------------
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('invalid body form');
  });

  it('should fail without user auth', async () => {
    // request to create project ----------------------------------------------
    const response = await request(app.callback())
      .post('/api/project')
      .send(mockProject);

    // check if failed with 'no token' ----------------------------------------
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});

describe('project deletion', () => {
  let projectsToDelete: project[] = [];
  const prisma = new PrismaClient();

  beforeEach(async () => {
    projectsToDelete.push(
      await prisma.project.create({
        data: {
          title: 'failed project',
          contents: 'delete me',
        },
      })
    );
  });

  afterAll(async () => {
    await prisma.project.delete({
      where: {
        projectId: projectsToDelete[0].projectId,
      },
    });
  });

  it('should delete project', async () => {
    const project = projectsToDelete.pop();

    const response = await request(app.callback())
      .delete(`/api/project/${project.projectId}`)
      .set('authorization', mockUserToken);

    expect(response.status).toBe(204);
  });

  it('should not delete project with irrelevant user', async () => {
    const project = projectsToDelete.pop();

    const response = await request(app.callback())
      .delete(`/api/project/${project.projectId}`)
      .set('authorization', mockUserToken);

    expect(response.status).toBe(403);

    await prisma.project.delete({
      where: {
        projectId: project.projectId,
      },
    });
  });

  it('should reject not existing project', async () => {
    const response = await request(app.callback())
      .delete('/api/project/not-a-number')
      .set('authorization', mockUserToken);

    expect(response.status).toBe(400);
  });
});
