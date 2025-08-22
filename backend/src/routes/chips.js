// backend/src/routes/chips.js
const router = require('express').Router();
const {
  getAllChips,
  getChipById,
  createChip,
  updateChip,
  deleteChip
} = require('../controllers/chipsController');

router.get('/', getAllChips);
router.get('/:id', getChipById);
router.post('/', createChip);
router.put('/:id', updateChip);
router.delete('/:id', deleteChip);

module.exports = router;