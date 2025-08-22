// backend/src/controllers/userController.js
const bcrypt = require('bcrypt');
const pool = require('../db');

exports.getUsers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, role FROM users ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rows } = await pool.query(
      'SELECT id, username, role FROM users WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updates = [];
    const values = [];

    if (req.body.username) {
      values.push(req.body.username);
      updates.push(`username = $${values.length}`);
    }

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      values.push(hash);
      updates.push(`password_hash = $${values.length}`);
    }

    // role は管理者のみ更新可能とルート層で制限
    if (req.body.role) {
      values.push(req.body.role);
      updates.push(`role = $${values.length}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: '更新対象が指定されていません' });
    }

    values.push(id);
    const sql = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING id, username, role
    `;
    const { rows } = await pool.query(sql, values);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};