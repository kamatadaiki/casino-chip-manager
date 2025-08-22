// backend/scripts/createDatabase.js
require('dotenv').config();
const { Client } = require('pg');

async function main() {
  // デフォルトの 'postgres' DB に接続
  const adminClient = new Client({
    connectionString: process.env.DATABASE_URL.replace(/\/[^/]+$/, '/postgres')
  });
  await adminClient.connect();

  // 存在チェック＋作成
  const dbName = 'casino_db';
  const { rows } = await adminClient.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
  );
  if (rows.length === 0) {
    await adminClient.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ データベース "${dbName}" を作成しました`);
  } else {
    console.log(`ℹ️ データベース "${dbName}" は既に存在します`);
  }

  await adminClient.end();
}

main().catch(err => {
  console.error('❌ データベース作成中にエラー', err);
  process.exit(1);
});