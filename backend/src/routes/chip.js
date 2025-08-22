// backend/routes/chips.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// 1. 全件取得
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM chips ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 2. ID指定取得
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM chips WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Chip not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// 3. 新規作成
router.post('/', async (req, res, next) => {
  try {
    const { color, value } = req.body;
    const { rows } = await db.query(
      'INSERT INTO chips(color, value) VALUES($1, $2) RETURNING *',
      [color, value]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// 4. 更新
router.put('/:id', async (req, res, next) => {
  try {
    const { color, value } = req.body;
    const { rows } = await db.query(
      'UPDATE chips SET color = $1, value = $2 WHERE id = $3 RETURNING *',
      [color, value, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Chip not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// 5. 削除
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM chips WHERE id = $1',
      [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Chip not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;