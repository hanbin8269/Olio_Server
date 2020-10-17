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