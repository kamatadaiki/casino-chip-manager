// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import chipsRouter from './routes/chips.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/chips', chipsRouter);

// エラーハンドラ
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// テスト用＆本番用のエントリポイント
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;