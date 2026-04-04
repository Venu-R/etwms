const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const log = require('../middleware/activityLogger');

router.get('/', protect, role('admin', 'manager'), ctrl.getAllUsers);
router.get('/:id', protect, role('admin'), ctrl.getUserById);
router.put('/:id', protect, role('admin'),
	log('USER_UPDATED', 'user', (req) => req.params.id),
	ctrl.updateUser);
router.delete('/:id', protect, role('admin'),
	log('USER_DELETED', 'user', (req) => req.params.id),
	ctrl.deleteUser);

module.exports = router;
