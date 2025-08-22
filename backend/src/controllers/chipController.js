// backend/src/controllers/chipsController.js
const pool = require('../config/db');

async function getAllChips(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM chips');
    res.json({ chips: rows });
  } catch (err) {
    next(err);
  }
}

async function getChipById(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM chips WHERE id=$1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Chip not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createChip(req, res, next) {
  try {
    const { name, value } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO chips(name, value) VALUES($1, $2) RETURNING *',
      [name, value]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateChip(req, res, next) {
  try {
    const { id } = req.params;
    const { name, value } = req.body;
    const { rows } = await pool.query(
      'UPDATE chips SET name=$1, value=$2 WHERE id=$3 RETURNING *',
      [name, value, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Chip not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteChip(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM chips WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllChips,
  getChipById,
  createChip,
  updateChip,
  deleteChip
};