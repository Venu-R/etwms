const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const log = require('../middleware/activityLogger');

router.post('/', protect, role('manager'), log('TASK_CREATED', 'task', (req, body) => body.data.task._id), ctrl.createTask);
router.get('/my', protect, role('employee'), ctrl.getMyTasks);
router.get('/:projectId', protect, role('manager', 'admin'), ctrl.getTasksByProject);
router.put('/:id', protect, role('employee', 'manager'), log('TASK_UPDATED', 'task', (req) => req.params.id), ctrl.updateTask);
router.post('/:id/comment', protect, log('TASK_COMMENTED', 'task', (req) => req.params.id), ctrl.addComment);
router.delete('/:id', protect, role('manager'), log('TASK_DELETED', 'task', (req) => req.params.id), ctrl.deleteTask);

module.exports = router;
