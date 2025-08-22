// backend/scripts/createTable.js
require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS chips (
      id SERIAL PRIMARY KEY,
      color TEXT NOT NULL,
      value INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      chip_id INTEGER REFERENCES chips(id),
      amount INTEGER NOT NULL,
      transacted_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('✅ users, chips, transactions テーブルを作成しました');
  await client.end();
}
main().catch(err => {
  console.error('❌ テーブル作成中にエラー', err);
  process.exit(1);
});