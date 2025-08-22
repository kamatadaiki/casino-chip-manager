const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chipRouter = require('./routes/chip');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/chips', chipRouter);

// ヘルスチェック用エンドポイント
app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});