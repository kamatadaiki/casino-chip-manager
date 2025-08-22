// backend/src/models/user.js

// データベース接続設定ファイル（例：src/config/db.js）を用意している前提
const pool = require('../config/db');

/**
 * 全ユーザーを取得
 */
async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, username, email, role FROM users ORDER BY id'
  );
  return rows;
}

/**
 * PK でユーザーを取得
 */
async function findByPk(id) {
  const { rows } = await pool.query(
    'SELECT id, username, email, role FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
}

/**
 * 更新したユーザーを返す
 */
async function updateById(id, data) {
  const setClauses = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    setClauses.push(`${key} = $${idx}`);
    values.push(val);
    idx++;
  }
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING id, username, email, role`,
    values
  );
  return rows[0];
}

/**
 * 削除
 */
async function deleteById(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return;
}

module.exports = {
  findAll,
  findByPk,
  updateById,
  deleteById,
};