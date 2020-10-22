import * as request from 'supertest';
import app from '../app';

describe('Server works', () => {
  it('should return 404 with wrong path', async () => {
    const response = await request(app.callback()).get('/');

    expect(response.status).toBe(404);
  });
});
