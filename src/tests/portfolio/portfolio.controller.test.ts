import * as request from 'supertest';
import app from '../../app';

// require('../server'); 서버 키기

const mockUser1 = {
  email: 'mockuser123@example.com',
  password: 'mypassword',
};

const mockProject = {
  title: 'My First Project',
  contents: 'This is a project for testing',
  tags: ['AI', 'CNN', '테스팅'],
  languages: ['Python', 'C'],
  participants: [mockUser1.email],
};

const mockPortfolio = {
  title: 'first_portfolio',
  owner: mockUser1.email,
  projects: [mockProject],
};

beforeAll(() => {
  require('../server');
});

describe('create portfolio', () => {
  it('should success to create portfolio', async () => {
    const response = await request(app.callback())
      .post('/api/portfolios/vi')
      .send(mockPortfolio);

    expect(response.status).toBe(201);
  });

  it('should failed with blank title', async () => {
    const response = await request(app.callback())
      .post('/api/portfolios/vi')
      .send({
        title: '',
        owner: mockUser1.email,
        projects: [mockProject],
      });

    expect(response.status).toBe(400);
  });
});

// describe('get portfolio', async () =>{
//   it('should be success with existed ')
// });
