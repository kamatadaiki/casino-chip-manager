// backend/src/tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const pool = require('../db');
const bcrypt = require('bcrypt');

beforeAll(async () => {
  // テスト前にユーザーをクリア
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});

describe('Auth Endpoints', () => {

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass', role: 'player' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.username).toBe('testuser');
      expect(res.body.role).toBe('player');
    });

    it('should reject duplicate usernames', async () => {
      await request(app)
        .post('/auth/register')
        .send({ username: 'dupuser', password: 'pass1', role: 'player' });

      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'dupuser', password: 'pass2', role: 'player' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already/i);
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      // 既存ユーザーを手動で作成
      const hash = await bcrypt.hash('mypassword', 10);
      await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
        ['loginuser', hash, 'player']
      );
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'loginuser', password: 'mypassword' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'loginuser', password: 'wrongpass' });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/認証失敗/);
    });
  });

});