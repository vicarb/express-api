const request = require('supertest');
const app = require('./app');

describe('GET /api/data', () => {
  it('should return a list of data entries', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
