const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const log = require('../middleware/activityLogger');

router.get('/', protect, role('admin'), ctrl.getAllUsers);
router.get('/:id', protect, role('admin'), ctrl.getUserById);
router.put('/:id', protect, role('admin'),
	log('USER_UPDATED', 'user', (req) => req.params.id),
	ctrl.updateUser);

module.exports = router;
