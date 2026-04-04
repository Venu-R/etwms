const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/login', auth.login);
router.post('/register', protect, require('../middleware/roleMiddleware')('admin'), auth.register);
router.get('/me', protect, auth.getMe);

module.exports = router;
