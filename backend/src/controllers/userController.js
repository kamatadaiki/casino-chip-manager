// backend/src/controllers/userController.js

const User = require('../models/user');

/**
 * 全ユーザー取得
 */
async function getAllUsers(req, res, next) {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

/**
 * ID指定ユーザー取得
 */
async function getUserById(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * ユーザー情報更新
 */
async function updateUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 更新可能なフィールドだけピックアップ
    const updatable = ['username', 'email', 'role'];
    updatable.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * ユーザー削除
 */
async function deleteUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};