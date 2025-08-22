// backend/src/models/chip.js

const pool = require('../config/db');

/**
 * 全チップを取得
 */
async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, label, value, color FROM chips ORDER BY id'
  );
  return rows;
}

/**
 * 主キーでチップを取得
 */
async function findByPk(id) {
  const { rows } = await pool.query(
    'SELECT id, label, value, color FROM chips WHERE id = $1',
    [id]
  );
  return rows[0];
}

/**
 * 新規チップを作成
 */
async function create(data) {
  const { label, value, color } = data;
  const { rows } = await pool.query(
    'INSERT INTO chips (label, value, color) VALUES ($1, $2, $3) RETURNING id, label, value, color',
    [label, value, color]
  );
  return rows[0];
}

/**
 * ID指定でチップを更新
 */
async function updateById(id, data) {
  const keys   = Object.keys(data);
  const values = Object.values(data);
  const setClauses = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE chips SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING id, label, value, color`,
    values
  );
  return rows[0];
}

/**
 * ID指定でチップを削除
 */
async function deleteById(id) {
  await pool.query('DELETE FROM chips WHERE id = $1', [id]);
  return;
}

module.exports = {
  findAll,
  findByPk,
  create,
  updateById,
  deleteById,
};