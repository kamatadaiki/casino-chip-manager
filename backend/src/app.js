// backend/src/app.js
const express   = require('express');
const app       = express();

app.use(express.json());

// リクエストログ（デバッグ用）
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// API ルーター
app.use('/api/chips', require('./routes/chips'));
app.use('/api/users', require('./routes/users'));

// 404 ハンドラー
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// グローバルエラーハンドラー
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;