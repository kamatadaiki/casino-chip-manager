// backend/src/app.js
require('dotenv').config();
const express        = require('express');
const morgan         = require('morgan');
const authRoutes     = require('./routes/auth');
const chipRoutes     = require('./routes/chips');
const userRoutes     = require('./routes/users');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// JSON ボディのパース
app.use(express.json());

// リクエストログ
app.use(morgan('dev'));

// ルートマウント
app.use('/auth', authRoutes);
app.use('/chips', chipRoutes);
app.use('/users', userRoutes);

// 404 ハンドリング
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// エラーハンドラ
app.use(errorHandler);

module.exports = app;