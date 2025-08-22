// backend/src/tests/chips.test.js
const request = require('supertest');
const app = require('../app');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let adminToken;

beforeAll(async () => {
  // テーブルクリア
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM chips');

  // 管理者ユーザー作成＆トークン生成
  const pwHash = await bcrypt.hash('adminpass', 10);
  const { rows } = await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, role',
    ['admin', pwHash, 'admin']
  );
  adminToken = jwt.sign(
    { id: rows[0].id, role: rows[0].role },
    process.env.JWT_SECRET || 'your-very-secure-secret',
    { expiresIn: '2h' }
  );

  // 初期チップを投入
  await pool.query(
    'INSERT INTO chips (name, color, value) VALUES ($1, $2, $3)',
    ['Initial Chip', 'grey', 5]
  );
});

afterAll(async () => {
  await pool.end();
});

describe('Chips API', () => {

  it('GET /chips returns seeded chips', async () => {
    const res = await request(app)
      .get('/chips')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Initial Chip', color: 'grey', value: 5 })
      ])
    );
  });

  it('POST /chips creates a new chip', async () => {
    const res = await request(app)
      .post('/chips')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Chip', color: 'pink', value: 15 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Chip');
    expect(res.body.color).toBe('pink');
  });

  it('PUT /chips/:id updates a chip', async () => {
    const insert = await pool.query(
      'INSERT INTO chips (name, color, value) VALUES ($1, $2, $3) RETURNING id',
      ['Updatable', 'orange', 20]
    );
    const id = insert.rows[0].id;

    const res = await request(app)
      .put(`/chips/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated', color: 'black' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated');
    expect(res.body.color).toBe('black');
  });

  it('DELETE /chips/:id removes a chip', async () => {
    const insert = await pool.query(
      'INSERT INTO chips (name, color, value) VALUES ($1, $2, $3) RETURNING id',
      ['Deletable', 'white', 25]
    );
    const id = insert.rows[0].id;

    const res = await request(app)
      .delete(`/chips/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);

    const check = await pool.query('SELECT * FROM chips WHERE id = $1', [id]);
    expect(check.rowCount).toBe(0);
  });

});