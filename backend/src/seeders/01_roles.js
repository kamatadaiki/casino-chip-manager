// backend/src/seeders/01_roles.js
const pool = require('../db');

async function seedRoles() {
  const roles = ['admin', 'player'];
  console.log('Seeding roles…');

  for (const role of roles) {
    await pool.query(
      `INSERT INTO roles (name) 
       VALUES ($1)
       ON CONFLICT (name) DO NOTHING`,
      [role]
    );
    console.log(`  ✔ role '${role}' seeded`);
  }
}

module.exports = seedRoles;