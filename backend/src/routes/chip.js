const express = require('express');
const pool = require('../db');
const router = express.Router();

// 全チップ一覧を取得
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chips ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 単一チップを取得
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM chips WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chip not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新しいチップを登録
router.post('/', async (req, res) => {
  const { user_id, amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO chips(user_id, amount) VALUES($1, $2) RETURNING *',
      [user_id, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// チップの数量を更新
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE chips SET amount = $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chip not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// チップを削除
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM chips WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chip not found' });
    }
    res.json({ message: 'Chip deleted', chip: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;