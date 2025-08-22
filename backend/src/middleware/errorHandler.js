// backend/src/middleware/errorHandler.js
exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  // Postgres のユニーク違反など特定のエラーコードをハンドリング
  if (err.code === '23505') {
    return res.status(400).json({ message: '既に存在するリソースです' });
  }

  // バリデーションエラー (Joi / express-validator) があれば同様に変換可能
  // if (err.isJoi) { … }

  res.status(err.status || 500).json({
    message: err.message || 'サーバー内部エラー',
  });
};