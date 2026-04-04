const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/me', protect, auth.getMe);

module.exports = router;
