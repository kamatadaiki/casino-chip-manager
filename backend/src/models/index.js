// backend/src/models/index.js

const User = require('./user');
const Chip = require('./chip');

// 必要に応じて他のモデルもここでまとめる
module.exports = {
  User,
  Chip,
};
