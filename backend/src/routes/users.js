// src/routes/users.js
const express      = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize }    = require('../middleware/authorize');
const userCtrl         = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);

router.get('/',        authorize('admin'),              userCtrl.getAllUsers);
router.get('/:id',     authorize('admin','player'),     userCtrl.getUserById);
router.put('/:id',     authorize('admin','player'),     userCtrl.updateUser);
router.delete('/:id',  authorize('admin'),              userCtrl.deleteUser);

module.exports = router;