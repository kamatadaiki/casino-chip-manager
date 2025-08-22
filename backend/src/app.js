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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));