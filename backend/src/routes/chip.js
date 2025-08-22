const express = require('express');
const router = express.Router();

// GET /api/chips
router.get('/', async (req, res) => {
  // チップ一覧取得ロジック
  res.json({ chips: [] });
});

module.exports = router;