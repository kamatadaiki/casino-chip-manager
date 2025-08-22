/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {};
// migrations/1755882624207_seed-chips.cjs

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO chips (name, color) VALUES
      ('white', 'white'),
      ('red',   'red'),
      ('blue',  'blue');
  `);
};

exports.down = (pgm) => {
  pgm.sql('DELETE FROM chips;');
};