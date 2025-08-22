// backend/src/seeders/02_users.js
const bcrypt = require('bcrypt');
const pool = require('../db');

async function seedUsers() {
  const adminUser = {
    username: process.env.SEED_ADMIN_USER || 'admin',
    password: process.env.SEED_ADMIN_PASS || 'password123',
    role: 'admin',
  };

  console.log('Seeding users…');

  // role_id を取得
  const { rows } = await pool.query(
    'SELECT id FROM roles WHERE name = $1',
    [adminUser.role]
  );
  const roleId = rows[0]?.id;
  if (!roleId) throw new Error(`Role '${adminUser.role}' not found`);

  const hash = await bcrypt.hash(adminUser.password, 10);

  await pool.query(
    `INSERT INTO users (username, password_hash, role_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING`,
    [adminUser.username, hash, roleId]
  );

  console.log(`  ✔ user '${adminUser.username}' seeded`);
}

module.exports = seedUsers;