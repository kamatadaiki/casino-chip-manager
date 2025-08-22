// backend/src/routes/auth.js
const express = require('express')
const { register, login } = require('../controllers/authController')

const router = express.Router()

// 新規ユーザー登録
router.post('/register', register)

// ログイン
router.post('/login', login)

module.exports = router