// backend/scripts/seedData.js
require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  // users テーブルにサンプルユーザーを追加
  await client.query(`
    INSERT INTO users (name, email)
    VALUES
      ('Alice', 'alice@example.com'),
      ('Bob',   'bob@example.com')
    ON CONFLICT DO NOTHING;
  `);

  // chips テーブルに定義済の色・価値を追加
  await client.query(`
    INSERT INTO chips (color, value)
    VALUES
      ('red',    5),
      ('blue',  10),
      ('green', 25),
      ('black',100)
    ON CONFLICT DO NOTHING;
  `);

  console.log('✅ シードデータを投入しました');
  await client.end();
}

main().catch(err => {
  console.error('❌ シードデータ投入時エラー', err);
  process.exit(1);
});