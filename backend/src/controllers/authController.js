// backend/src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hash, role]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    // ユニーク制約などのDBエラーはここでキャッチ
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: '認証失敗: ユーザーが存在しません' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: '認証失敗: パスワードが違います' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};