// backend/tests/chips.test.js
const request = require('supertest');
const app     = require('../src/app');
const pool    = require('../src/config/db');

beforeAll(async () => {
  await pool.query('DELETE FROM chips');
});

afterAll(async () => {
  await pool.end();
});

test('GET /api/chips returns empty array', async () => {
  const res = await request(app).get('/api/chips');
  expect(res.statusCode).toBe(200);
  expect(res.body.chips).toEqual([]);
});