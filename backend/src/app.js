// backend/app.js
const express = require('express');
const chipsRouter = require('./routes/chip');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/chips', chipsRouter);

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});