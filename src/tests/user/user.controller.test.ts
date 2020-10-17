import * as request from 'supertest';
import app from '../../app';

// require('../server'); 서버 키기

beforeAll(() => {
  require('../server');
});

describe('login', () => {
  it('should be success with correct user info', async () => {
    const response = await request(app.callback())
      .post('/api/user/v1/login')
      .send({
        email: 'hanbin8269@gmail.com',
        password: '0128gksqls',
      });

    expect(response.status).toBe(200);
  });

  it('should be failed with incorrect user email', async () => {
    const response = await request(app.callback())
      .post('/api/user/v1/login')
      .send({
        email: 'hanbil.com',
        password: '0128gksqls',
      });

    expect(response.status).toBe(400);
  });

  it('should be failed with incorrect user password', async () => {
    const response = await request(app.callback())
      .post('/api/user/v1/login')
      .send({
        email: 'hanbin8269@gmail.com',
        password: '1234',
      });

    expect(response.status).toBe(400);
  });
});

describe('register', () => {
  it('should be success with correct form', async () => {
    const response = await request(app.callback()).post('/api/user/v1/').send({
      email: 'gksqls0128@gmail.com',
      password: '0128gksqls',
    });

    expect(response.status).toBe(201);
  });

  it('should be failed with incorrect email form', async () => {
    const response = await request(app.callback()).post('/api/user/v1/').send({
      email: 'gksqls0128com',
      password: '0128gksqls',
    });

    expect(response.status).toBe(400);
  });

  it('should be failed with duplicated account', async () => {
    const response = await request(app.callback()).post('/api/user/v1/').send({
      email: 'hanbin8269@gmail.com',
      password: '0128gksqls',
    });

    expect(response.status).toBe(400);
  });
});