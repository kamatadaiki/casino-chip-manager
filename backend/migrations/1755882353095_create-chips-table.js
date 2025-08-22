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

// migrations/1755882353095_create-chips-table.js

exports.up = (pgm) => {
  pgm.createTable('chips', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'text', notNull: true },
    value: { type: 'integer', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('chips');
};