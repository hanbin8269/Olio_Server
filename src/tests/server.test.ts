import * as request from 'supertest';
import app from '../app';

const mockListen = jest.fn();
app.listen = mockListen;

afterEach(() => {
  mockListen.mockReset();
});

describe('Server works', () => {
  it('should turn on the server', async () => {
    require('../server');
    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(process.env.PORT || 5000);
  });

  it('should return 404 with wrong path', async () => {
    const response = await request(app.callback()).get('/');

    expect(response.status).toBe(404);
  });
});
