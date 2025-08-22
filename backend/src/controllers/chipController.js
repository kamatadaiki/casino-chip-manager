// backend/src/controllers/chipController.js
const pool = require('../db');

exports.getAllChips = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM chips ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createChip = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO chips (name, color) VALUES ($1, $2) RETURNING *',
      [name, color]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateChip = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, color } = req.body;
    const { rows } = await pool.query(
      'UPDATE chips SET name = $1, color = $2 WHERE id = $3 RETURNING *',
      [name, color, id]
    );
    if (!rows[0]) {
      return res.sendStatus(404);
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteChip = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rowCount } = await pool.query(
      'DELETE FROM chips WHERE id = $1',
      [id]
    );
    if (rowCount === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};