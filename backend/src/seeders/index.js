// backend/src/seeders/index.js
require('dotenv').config();
const pool       = require('../db');
const seedRoles  = require('./01_roles');
const seedUsers  = require('./02_users');
const seedChips  = require('./03_chips');

async function runSeeders() {
  try {
    console.log('Start seeding database');
    await seedRoles();
    await seedUsers();
    await seedChips();
    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

runSeeders();