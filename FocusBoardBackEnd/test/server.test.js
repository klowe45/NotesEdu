const request = require('supertest');
const app = require('../server');

describe('Server', () => {
  test('GET / should return API status', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('FocusBoard API is running!');
  });
});

describe('Auth Routes', () => {
  test('POST /api/auth/login should return login message', async () => {
    const response = await request(app).post('/api/auth/login');
    expect(response.status).toBe(200);
  });
});

describe('Client Routes', () => {
  test('GET /api/clients should return clients message', async () => {
    const response = await request(app).get('/api/clients');
    expect(response.status).toBe(200);
  });
});