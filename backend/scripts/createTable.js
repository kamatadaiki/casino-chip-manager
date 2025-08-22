// scripts/createTable.js

require('dotenv').config();
const pool = require('../src/db');

(async () => {
  try {
    // chips テーブルが存在しなければ作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chips (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ chips テーブルを作成しました');
  } catch (err) {
    console.error('❌ テーブル作成エラー:', err);
  } finally {
    // プールを終了してプロセスを抜ける
    await pool.end();
    process.exit();
  }
})();