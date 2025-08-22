// backend/src/config/db.js

// .env ファイルから環境変数を読み込む
require('dotenv').config();

const { Pool } = require('pg');

// Pool の設定は環境変数を優先し、無い場合はデフォルトを指定
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  user:     process.env.DB_USER     || 'your_db_user',
  password: process.env.DB_PASSWORD || 'your_db_password',
  database: process.env.DB_NAME     || 'casino_chip_db',
  ssl:      process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;