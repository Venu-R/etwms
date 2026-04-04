const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/admin', protect, role('admin'), ctrl.adminDashboard);
router.get('/manager', protect, role('manager'), ctrl.managerDashboard);
router.get('/employee', protect, role('employee'), ctrl.employeeDashboard);
router.get('/logs', protect, role('admin'), ctrl.getActivityLogs);

module.exports = router;
