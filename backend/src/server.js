// backend/src/server.js
// backend/src/server.js
require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// サーバ起動
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// グレースフルシャットダウン
const shutdown = () => {
  console.log('Shutting down server...');
  
  // HTTP サーバをクローズ
  server.close(() => {
    console.log('HTTP server closed.');

    // DB プールを終了
    pool.end(() => {
      console.log('Database pool has ended.');
      process.exit(0);
    });
  });
};

// SIGINT (Ctrl+C) / SIGTERM に対応
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);