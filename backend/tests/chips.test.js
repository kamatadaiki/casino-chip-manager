// tests/chips.test.js
import request from 'supertest';
import app from '../src/server.js';
import { pool } from '../src/db.js';

// テスト用 DB をクリーンアップ
beforeAll(async () => {
  await pool.query('DELETE FROM transactions');
  await pool.query('DELETE FROM chips');
});

afterAll(async () => {
  await pool.end();
});

describe('CRUD /api/chips', () => {
  let created;

  test('GET 空の chips は空配列を返す', async () => {
    const res = await request(app).get('/api/chips');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST 新しいチップを作成', async () => {
    const payload = { name: 'green', color: 'green' };
    const res = await request(app).post('/api/chips').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(res.body.id).toBeDefined();
    created = res.body;
  });

  test('GET 作成したチップが含まれる', async () => {
    const res = await request(app).get('/api/chips');
    expect(res.body).toContainEqual(created);
  });

  test('PUT 既存チップを更新', async () => {
    const updated = { name: 'emerald', color: 'darkgreen' };
    const res = await request(app)
      .put(`/api/chips/${created.id}`)
      .send(updated);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ...updated, id: created.id });
  });

  test('DELETE 既存チップを削除', async () => {
    const res = await request(app).delete(`/api/chips/${created.id}`);
    expect(res.status).toBe(204);
    const getRes = await request(app).get('/api/chips');
    expect(getRes.body).not.toContainEqual(expect.objectContaining({ id: created.id }));
  });
});