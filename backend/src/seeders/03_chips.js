// backend/src/seeders/03_chips.js
const pool = require('../db');

async function seedChips() {
  const chips = [
    { name: 'Red Chip',   color: 'red',    value: 10 },
    { name: 'Blue Chip',  color: 'blue',   value: 50 },
    { name: 'Green Chip', color: 'green',  value: 100 },
    { name: 'Black Chip', color: 'black',  value: 500 },
  ];

  console.log('Seeding chips…');

  for (const chip of chips) {
    await pool.query(
      `INSERT INTO chips (name, color, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (name) DO NOTHING`,
      [chip.name, chip.color, chip.value]
    );
    console.log(`  ✔ chip '${chip.name}' seeded`);
  }
}

module.exports = seedChips;