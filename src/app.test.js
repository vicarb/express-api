import request from 'supertest';
import app from './app';

describe('GET /api/data', () => {
  it('should return a list of data entries', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Use response.body here
  });

  it('should handle errors', async () => {
    const response = await request(app).get('/api/data-invalid-url');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not Found'); // Use response.body here
  });
});

describe('GET /api/data/:id', () => {
  it('should return a specific data entry', async () => {
    // Assuming you have a valid ID in your database
    const dataId = '60f4b8aa9bfc27abc1234567';
    const response = await request(app).get(`/api/data/${dataId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', dataId); // Use response.body here
  });

  it('should handle data not found', async () => {
    const invalidId = 'invalid-id'; // Assuming this ID does not exist in your database
    const response = await request(app).get(`/api/data/${invalidId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Data not found'); // Use response.body here
  });
});
