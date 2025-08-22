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
  // 先に外部キー制約を削除
  pgm.dropConstraint('transactions', 'transactions_chip_id_fkey', {
    ifExists: true
  });

  // テーブルを削除
  pgm.dropTable('chips');
};