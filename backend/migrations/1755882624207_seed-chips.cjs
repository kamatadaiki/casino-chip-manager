// migrations/1755882624207_seed-chips.cjs

// shorthands をエクスポート
exports.shorthands = undefined;

// up 関数をエクスポート
exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO chips (name, color) VALUES
      ('white', 'white'),
      ('red',   'red'),
      ('blue',  'blue');
  `);
};

// down 関数をエクスポート
exports.down = (pgm) => {
  pgm.sql('DELETE FROM chips;');
};