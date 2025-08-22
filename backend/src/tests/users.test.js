// backend/src/tests/users.test.js
const request = require('supertest');
const app = require('../app');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let adminToken;
let playerToken;
let adminId;
let playerId;

beforeAll(async () => {
  // テーブルクリア
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM chips');

  // 管理者ユーザー作成
  const adminHash = await bcrypt.hash('adminpass', 10);
  const adminRes = await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
    ['admin', adminHash, 'admin']
  );
  adminId = adminRes.rows[0].id;
  adminToken = jwt.sign(
    { id: adminId, role: 'admin' },
    process.env.JWT_SECRET || 'your-very-secure-secret'
  );

  // プレイヤーユーザー作成
  const playerHash = await bcrypt.hash('playerpass', 10);
  const playerRes = await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
    ['player', playerHash, 'player']
  );
  playerId = playerRes.rows[0].id;
  playerToken = jwt.sign(
    { id: playerId, role: 'player' },
    process.env.JWT_SECRET || 'your-very-secure-secret'
  );
});

afterAll(async () => {
  await pool.end();
});

describe('Users API', () => {

  describe('GET /users', () => {
    it('allows admin to list users', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('forbids player from listing users', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${playerToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user for authenticated requests', async () => {
      const res = await request(app)
        .get(`/users/${playerId}`)
        .set('Authorization', `Bearer ${playerToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(playerId);
      expect(res.body.username).toBe('player');
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/users/9999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /users/:id', () => {
    it('admin can update any user', async () => {
      const res = await request(app)
        .put(`/users/${playerId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: 'player2' });
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('player2');
    });

    it('player can update own profile', async () => {
      const res = await request(app)
        .put(`/users/${playerId}`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ username: 'player3' });
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('player3');
    });

    it('player cannot update other users', async () => {
      const res = await request(app)
        .put(`/users/${adminId}`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ username: 'hacker' });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /users/:id', () => {
    it('admin can delete a user', async () => {
      const newUser = await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
        ['tobedeleted', await bcrypt.hash('pass', 10), 'player']
      );
      const idToDelete = newUser.rows[0].id;

      const res = await request(app)
        .delete(`/users/${idToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);

      const check = await pool.query('SELECT * FROM users WHERE id = $1', [idToDelete]);
      expect(check.rowCount).toBe(0);
    });

    it('player cannot delete users', async () => {
      const res = await request(app)
        .delete(`/users/${playerId}`)
        .set('Authorization', `Bearer ${playerToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

});