// migrations/1755882353095_create-chips-table.cjs

// shorthands をエクスポート
exports.shorthands = undefined;

// up 関数をエクスポート
exports.up = (pgm) => {
  pgm.createTable('chips', {
    id: 'id',
    name: { type: 'text', notNull: true },
    color: { type: 'text', notNull: true },
    // …必要なカラム定義
  });
};

// down 関数をエクスポート
exports.down = (pgm) => {
  pgm.dropTable('chips');
};