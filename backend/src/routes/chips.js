// backend/src/routes/chips.js
const express = require('express')
const { authenticate } = require('../middleware/auth')
const { authorize }   = require('../middleware/authorize')
const chipCtrl       = require('../controllers/chipController')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ chips: [] });  // 仮レスポンス
});

// すべての /chips エンドポイントで認証を実施
router.use(authenticate)

// 管理者とプレイヤーは閲覧可能
router.get('/', authorize('admin', 'player'), chipCtrl.getAllChips)

// 管理者のみ作成・更新・削除可能
router.post('/', authorize('admin'), chipCtrl.createChip)
router.put('/:id', authorize('admin'), chipCtrl.updateChip)
router.delete('/:id', authorize('admin'), chipCtrl.deleteChip)

module.exports = router