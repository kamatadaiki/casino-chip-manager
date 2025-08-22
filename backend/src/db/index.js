// index.js

// 環境変数のロード
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const chipRouter = require('./routes/chip');

const app = express();

// ミドルウェア設定
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ルーティング
app.use('/api/chips', chipRouter);

// 存在しないルートへの 404 ハンドリング
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

// 全体エラーハンドラー
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ status: 'error', message: err.message });
});

// サーバ起動
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});