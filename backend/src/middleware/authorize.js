// backend/src/middleware/authorize.js
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: '認証が必要です' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: '権限がありません' });
    }
    next();
  };
};