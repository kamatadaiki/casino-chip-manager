// backend/src/server.js
require('dotenv').config();
const app  = require('./app');
const pool = require('./config/db');

let PORT = parseInt(process.env.PORT, 10) || 3000;

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is in use, trying ${PORT + 1}...`);
      PORT += 1;
      setTimeout(startServer, 1000);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  // グレースフルシャットダウンはこの中に配置
  const shutdown = () => {
    server.close(() => {
      pool.end(() => process.exit(0));
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();