// backend/src/seeders/init_chips.js
require('dotenv').config();
const pool = require('../db');

async function initChips() {
  const chips = [
    { name: 'Red Chip',   color: 'red',    value: 10  },
    { name: 'Blue Chip',  color: 'blue',   value: 50  },
    { name: 'Green Chip', color: 'green',  value: 100 },
    { name: 'Black Chip', color: 'black',  value: 500 },
  ];

  console.log('Seeding chips…');
  for (const { name, color, value } of chips) {
    await pool.query(
      `INSERT INTO chips (name, color, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (name) DO NOTHING`,
      [name, color, value]
    );
    console.log(`  ✔ chip '${name}'`);
  }
}

if (require.main === module) {
  initChips()
    .then(() => {
      console.log('Chips initialization completed');
      return pool.end();
    })
    .catch(err => {
      console.error('Chips initialization failed:', err);
      process.exit(1);
    });
} else {
  module.exports = initChips;
}